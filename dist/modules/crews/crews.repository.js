"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewsRepositoryImpl = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const http_exception_1 = require("../../core/http_exception");
const users_1 = require("../users");
const workouts_1 = require("../workouts");
const catch_error_1 = require("../../decorators/catch_error");
const base_controller_1 = require("../../core/base_controller");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const generics_1 = require("../../types/generics");
const is_authenticated_1 = require("../../decorators/is_authenticated");
const routes_decorator_1 = require("../../decorators/routes.decorator");
const upload_decorator_1 = require("../../decorators/upload.decorator");
const crews_schema_1 = require("./crews.schema");
class CrewsRepository extends base_controller_1.DecoratorController {
    get_by_code(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const crew = yield crews_schema_1.CrewsModel.findOne({ code });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            return res.status(200).json(crew);
        });
    }
    get_rank(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { crew_id, show_all } = req.query;
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const is_member = crew.members.some((member) => member.user.toString() === user._id.toString());
            if (!is_member) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const crew_populated = yield crew.populate("members.user");
            const rank = crew_populated.members
                .map((member) => ({
                _id: member.user._id,
                name: member.user.name,
                avatar: member.user.avatar,
                character: member.user.character,
                coins: member.user.coins || 0,
            }))
                .sort((a, b) => {
                return a.coins < b.coins ? 1 : -1;
            });
            if (!show_all) {
                const first_three = rank.slice(0, 3);
                return res.status(200).json(first_three);
            }
            return res.status(200).json(rank);
        });
    }
    get_activities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { crew_id } = req.body;
            const { start_date, end_date } = req.query;
            const start_date_obj = start_date
                ? new Date(start_date)
                : new Date();
            const end_date_obj = end_date ? new Date(end_date) : new Date();
            start_date_obj.setHours(0, 0, 0, 0);
            end_date_obj.setHours(23, 59, 59, 999);
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const workouts = yield workouts_1.WorkoutsModel.find({
                shared_to: crew._id,
                user: { $in: crew.members.map((m) => m.user) },
                date: {
                    $gte: start_date_obj,
                    $lt: end_date_obj,
                },
            });
            return res.status(200).json(workouts);
        });
    }
    get_activities_days(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { start_date, end_date, crew_id } = req.query;
            const start_date_obj = start_date
                ? new Date(start_date)
                : new Date();
            const end_date_obj = end_date ? new Date(end_date) : new Date();
            start_date_obj.setHours(0, 0, 0, 0);
            end_date_obj.setHours(23, 59, 59, 999);
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const workouts = yield workouts_1.WorkoutsModel.aggregate([
                {
                    $match: {
                        shared_to: crew._id,
                        user: { $in: crew.members.map((m) => m.user) },
                        date: {
                            $gte: start_date_obj,
                            $lt: end_date_obj,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$date" },
                            month: { $month: "$date" },
                            day: { $dayOfMonth: "$date" },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
                },
            ]);
            const activities_days = workouts.map((workout) => ({
                date: new Date(workout._id.year, workout._id.month - 1, workout._id.day),
                count: workout.count,
            }));
            return res.status(200).json(activities_days);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const user = res.locals.user;
            let banner = undefined;
            if (file) {
                banner = {
                    public_id: file.filename,
                    url: file.path,
                };
            }
            const { name, visibility, code, rules } = req.body;
            const member = {
                user: user._id,
                is_admin: true,
                joined_at: new Date(),
            };
            const crew = yield crews_schema_1.CrewsModel.create({
                name,
                visibility,
                code,
                banner,
                rules,
                members: [member],
                created_by: user._id,
            });
            // [Journey] - Add a journey event for the crew creation
            const event = {
                _id: new mongoose_1.Types.ObjectId(),
                action: collections_1.JourneyEventAction.JOIN,
                schema: collections_1.JourneyEventSchemaType.Crew,
                created_at: new Date(),
                data: {
                    crew,
                },
            };
            yield user.add_journey_event(event);
            return res.status(201).json(crew);
        });
    }
    join(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            const user = res.locals.user;
            const crew = yield crews_schema_1.CrewsModel.findOne({ code });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const is_member = crew.members.some((m) => m.user.toString() === user._id.toString());
            if (is_member) {
                throw new http_exception_1.HttpException(400, "ALREADY_MEMBER");
            }
            const is_private = crew.visibility === "private";
            let joined = false;
            let in_whitelist = false;
            if (is_private) {
                yield crew.updateOne({
                    $addToSet: { white_list: user._id },
                });
                in_whitelist = true;
            }
            if (!is_private) {
                const new_member = {
                    user: user._id.toString(),
                    is_admin: false,
                    joined_at: new Date(),
                };
                yield crew.updateOne({
                    $addToSet: { members: new_member },
                });
                // [Notify] - Notify the crew of new member
                // [Journey] - Add a journey event for the crew join
                const event = {
                    _id: new mongoose_1.Types.ObjectId(),
                    action: collections_1.JourneyEventAction.JOIN,
                    schema: collections_1.JourneyEventSchemaType.Crew,
                    created_at: new Date(),
                    data: {
                        crew,
                    },
                };
                yield user.add_journey_event(event);
                joined = true;
            }
            return res.status(200).json({ joined, in_whitelist });
        });
    }
    accept_member(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = res.locals.user;
            const { user_id, code } = req.body;
            const new_member_user = yield users_1.UsersModel.findById(user_id);
            if (!new_member_user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const crew = yield crews_schema_1.CrewsModel.findOne({
                code,
            });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const admin_in_crew = crew.members.some((adm) => adm.user.toString() === admin._id.toString() && adm.is_admin);
            if (!admin_in_crew) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const user_in_white_list = crew.white_list &&
                crew.white_list.some((member) => member._id.toString() === new_member_user._id.toString());
            if (!user_in_white_list) {
                throw new http_exception_1.HttpException(400, "USER_NOT_IN_WHITELIST");
            }
            const new_member = {
                user: new_member_user._id,
                is_admin: false,
                joined_at: new Date(),
            };
            yield crew.updateOne({
                $pull: { white_list: new_member_user._id },
                $addToSet: { members: new_member },
            });
            // [Notify] - Notify the user that they have been accepted into the crew
            // [Journey] - Add a journey event for the crew join
            const event = {
                _id: new mongoose_1.Types.ObjectId(),
                action: collections_1.JourneyEventAction.JOIN,
                schema: collections_1.JourneyEventSchemaType.Crew,
                created_at: new Date(),
                data: {
                    crew,
                },
            };
            yield new_member_user.add_journey_event(event);
            return res.sendStatus(204);
        });
    }
    reject_member(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = res.locals.user;
            const { user_id, code } = req.body;
            const new_member_user = yield users_1.UsersModel.findById(user_id);
            if (!new_member_user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const crew = yield crews_schema_1.CrewsModel.findOne({
                code,
            });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const admin_in_crew = crew.members.some((adm) => adm.user.toString() === admin._id.toString() && adm.is_admin);
            if (!admin_in_crew) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const user_in_white_list = crew.white_list &&
                crew.white_list.some((member) => member._id.toString() === new_member_user._id.toString());
            if (!user_in_white_list) {
                throw new http_exception_1.HttpException(400, "USER_NOT_IN_WHITELIST");
            }
            yield crew.updateOne({
                $pull: { white_list: new_member_user._id },
            });
            return res.sendStatus(204);
        });
    }
    leave(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            const { user } = res.locals;
            const crew = yield crews_schema_1.CrewsModel.findOne({ code });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const member = crew.members.find((member) => member.user.toString() === user._id.toString());
            if (!member) {
                throw new http_exception_1.HttpException(400, "USER_NOT_A_MEMBER");
            }
            if (crew.created_by.toString() === user._id.toString()) {
                throw new http_exception_1.HttpException(400, "CANNOT_LEAVE_CREW_OWNER");
            }
            yield crew.updateOne({
                $pull: { members: member._id },
            });
            return res.sendStatus(204);
        });
    }
    kick_member(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, code } = req.body;
            const admin = res.locals.user;
            const user = yield users_1.UsersModel.findById(user_id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const crew = yield crews_schema_1.CrewsModel.findOne({
                code,
            });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const admin_in_crew = crew.members.some((adm) => adm.user.toString() === admin._id.toString() && adm.is_admin);
            if (!admin_in_crew) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const member = crew.members.find((member) => member.user.toString() === user._id.toString());
            if (!member) {
                throw new http_exception_1.HttpException(400, "USER_NOT_A_MEMBER");
            }
            crew.members.pull(member._id);
            yield crew.save();
            // [Notify] - Notify the user that they have been removed from crew
            return res.sendStatus(204);
        });
    }
    update_config(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { crew_id } = req.body;
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const is_admin = crew.members.some((member) => member.user.toString() === user._id.toString() && member.is_admin);
            if (!is_admin) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const { name, visibility, rules, lose_streak_in_days, streak } = req.body;
            const updated_crew = yield crews_schema_1.CrewsModel.findByIdAndUpdate(crew_id, {
                visibility,
                rules,
                lose_streak_in_days,
                streak,
            }, { new: true });
            return res.status(200).json(updated_crew);
        });
    }
    update_admin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, code, set_admin } = req.body;
            const admin = res.locals.user;
            const user = yield users_1.UsersModel.findById(user_id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const crew = yield crews_schema_1.CrewsModel.findOne({
                code,
            });
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const admin_in_crew = crew.members.some((adm) => adm.user.toString() === admin._id.toString() && adm.is_admin);
            if (!admin_in_crew) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const user_in_crew = crew.members.find((member) => member.user.toString() === user._id.toString());
            if (!user_in_crew) {
                throw new http_exception_1.HttpException(400, "USER_NOT_A_MEMBER");
            }
            yield crews_schema_1.CrewsModel.updateOne({
                "members._id": user_in_crew._id,
            }, {
                $set: {
                    "members.$.is_admin": set_admin,
                },
            });
            return res.sendStatus(204);
        });
    }
    favorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { crew_id } = req.body;
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const is_member = crew.members.some((member) => member.user.toString() === user._id.toString());
            if (!is_member) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            const is_favorite = !!user.favorites &&
                user.favorites.some((fav) => fav._id.toString() === crew._id.toString());
            if (!is_favorite) {
                yield user.updateOne({
                    $addToSet: { favorites: crew._id },
                });
                return res.sendStatus(204);
            }
            yield user.updateOne({
                $pull: { favorites: crew._id },
            });
            return res.sendStatus(204);
        });
    }
    update_banner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const file = req.file;
            const { crew_id } = req.body;
            if (!file) {
                throw new http_exception_1.HttpException(400, "FILE_NOT_PROVIDED");
            }
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const is_admin = crew.members.some((member) => member.user.toString() === user._id.toString() && member.is_admin);
            if (!is_admin) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            if (crew.banner && crew.banner.public_id) {
                yield (0, cloudinary_config_1.cloudinaryDestroy)(crew.banner.public_id);
            }
            const banner = {
                public_id: file.filename,
                url: file.path,
            };
            const updated_crew = yield crews_schema_1.CrewsModel.findByIdAndUpdate(crew_id, { banner }, { new: true });
            return res.status(200).json(updated_crew);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const crew_id = req.params.id;
            const crew = yield crews_schema_1.CrewsModel.findById(crew_id);
            if (!crew) {
                throw new http_exception_1.HttpException(404, "CREW_NOT_FOUND");
            }
            const is_owner = crew.created_by.toString() === user._id.toString();
            if (!is_owner) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            yield crew.deleteOne();
            // [Notify] - Notify the crew members that the crew has been deleted
            return res.sendStatus(204);
        });
    }
}
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.CrewsGetByCode),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "get_by_code", null);
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.CrewsGetRank),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "get_rank", null);
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.CrewsGetActivities),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "get_activities", null);
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.CrewsGetActivitiesDays),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "get_activities_days", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.CrewsCreate),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    (0, upload_decorator_1.Upload)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "create", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.CrewsJoin),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "join", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.CrewsAcceptMember),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "accept_member", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.CrewsRejectMember),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "reject_member", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.CrewsLeave),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "leave", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.CrewsKickMember),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "kick_member", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.CrewsUpdateConfig),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "update_config", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.CrewsUpdateAdmins),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "update_admin", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.CrewsFavorite),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "favorite", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.CrewsUpdateBanner),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    (0, upload_decorator_1.Upload)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "update_banner", null);
__decorate([
    (0, routes_decorator_1.Delete)(generics_1.Endpoints.CrewsDelete),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrewsRepository.prototype, "delete", null);
const CrewsRepositoryImpl = new CrewsRepository();
exports.CrewsRepositoryImpl = CrewsRepositoryImpl;
