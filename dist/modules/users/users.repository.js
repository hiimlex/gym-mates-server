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
exports.UsersRepositoryImpl = void 0;
const base_controller_1 = require("../../core/base_controller");
const http_exception_1 = require("../../core/http_exception");
const crews_1 = require("../crews");
const healthy_1 = require("../healthy");
const items_1 = require("../items");
const journey_1 = require("../journey");
const user_device_1 = require("../user_device");
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const generics_1 = require("../../types/generics");
const catch_error_1 = require("../../decorators/catch_error");
const users_schema_1 = require("./users.schema");
const routes_decorator_1 = require("../../decorators/routes.decorator");
const is_authenticated_1 = require("../../decorators/is_authenticated");
const upload_decorator_1 = require("../../decorators/upload.decorator");
class UsersRepository extends base_controller_1.DecoratorController {
    get_journey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const journey = yield journey_1.JourneyModel.findById(user.journey);
            if (!journey) {
                throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
            }
            const populated_journey = yield journey.populate({
                path: "inventory.item",
            });
            if (req.query.sort) {
                const sort = req.query.sort;
                populated_journey.events.sort((a, b) => {
                    if (sort === "recent") {
                        return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    }
                    return 0;
                });
            }
            if (req.query.action) {
                const action = req.query.action;
                populated_journey.events = populated_journey.events.filter((event) => event.action === action);
            }
            return res.status(200).json(populated_journey);
        });
    }
    get_followers_info(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const user_followers = yield users_schema_1.UsersModel.find({
                _id: { $in: user.followers },
            }).select("-password -email -healthy -journey");
            const user_following = yield users_schema_1.UsersModel.find({
                _id: { $in: user.following },
            }).select("-password -email -healthy -journey");
            const followers = [];
            const following = [];
            yield Promise.all(user_followers.map((follower) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const is_mutual = (_a = user.following) === null || _a === void 0 ? void 0 : _a.some((uf) => uf._id.toString() === follower._id.toString());
                const crews_in_common = yield crews_1.CrewsModel.find({
                    "members.user": { $all: [user._id, follower._id] },
                });
                followers.push({
                    user: follower,
                    is_mutual,
                    in_crews: crews_in_common,
                });
            })));
            yield Promise.all(user_following.map((follow) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const is_mutual = (_a = user.followers) === null || _a === void 0 ? void 0 : _a.some((uf) => uf._id.toString() === follow._id.toString());
                const crews_in_common = yield crews_1.CrewsModel.find({
                    "members.user": { $all: [user._id, follow._id] },
                });
                following.push({
                    user: follow,
                    is_mutual,
                    in_crews: crews_in_common,
                });
            })));
            return res.status(200).json({
                followers: followers,
                following: following,
            });
        });
    }
    follow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = res.locals.user;
            const { follower_id } = req.body;
            const friend = yield users_schema_1.UsersModel.findById(follower_id);
            if (!friend) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const already_following = (_a = friend.followers) === null || _a === void 0 ? void 0 : _a.includes(follower_id);
            if (already_following) {
                throw new http_exception_1.HttpException(400, "ALREADY_FOLLOWING");
            }
            yield friend.updateOne({
                $addToSet: { followers: user._id },
            });
            yield user.updateOne({
                $addToSet: { following: follower_id },
            });
            // [Notify] - Notify the friend about the new follower
            // [Journey] - Add a new event to the user's journey
            const event = {
                _id: new mongoose_1.Types.ObjectId(),
                action: collections_1.JourneyEventAction.FOLLOW,
                schema: collections_1.JourneyEventSchemaType.User,
                data: {
                    user: user,
                },
                created_at: new Date(),
            };
            yield user.add_journey_event(event);
            return res.sendStatus(204);
        });
    }
    unfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { follower_id } = req.body;
            const follower = yield users_schema_1.UsersModel.findById(follower_id);
            if (!follower) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            yield follower.updateOne({
                $pull: { followers: user._id },
            });
            yield user.updateOne({
                $pull: { following: follower_id },
            });
            return res.sendStatus(204);
        });
    }
    create_healthy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { weight, height, body_fat } = req.body;
            const healthy_info = yield healthy_1.HealthyModel.create({
                weight,
                height,
                body_fat,
                user: user._id,
            });
            yield user.updateOne({
                $set: { healthy: healthy_info._id },
            });
            // [Journey] - Add a new event to the user's journey
            const event = {
                _id: new mongoose_1.Types.ObjectId(),
                action: collections_1.JourneyEventAction.ADD,
                schema: collections_1.JourneyEventSchemaType.Healthy,
                data: {
                    healthy_info,
                },
                created_at: new Date(),
            };
            yield user.add_journey_event(event);
            return res.status(200).json(healthy_info);
        });
    }
    select_title(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const journey = res.locals.journey;
            const { title_id } = req.body;
            const title = yield items_1.TitlesModel.findById(title_id);
            if (!title || !title_id) {
                throw new http_exception_1.HttpException(404, "TITLE_NOT_FOUND");
            }
            if (!journey.inventory.some((item) => item.item.toString() === title_id)) {
                throw new http_exception_1.HttpException(400, "USER_DOES_NOT_OWN_ITEM");
            }
            yield user.updateOne({
                $set: { title: title._id },
            });
            return res.sendStatus(204);
        });
    }
    update_avatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const user = res.locals.user;
            if (!file) {
                throw new http_exception_1.HttpException(400, "FILE_NOT_PROVIDED");
            }
            if (!user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const updated_user = yield users_schema_1.UsersModel.findByIdAndUpdate(user._id, {
                avatar: {
                    public_id: file.filename,
                    url: file.path,
                },
            }, { new: true });
            return res.status(200).json(updated_user);
        });
    }
    update_profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { name, email, oldPassword, newPassword } = req.body;
            if (oldPassword && newPassword) {
                const is_password_valid = (0, bcrypt_1.compareSync)(oldPassword, user.password);
                if (!is_password_valid) {
                    throw new http_exception_1.HttpException(403, "UNAUTHORIZED");
                }
                const hash_password = (0, bcrypt_1.hashSync)(newPassword, generics_1.HashSalt);
                user.password = hash_password;
            }
            if (name) {
                user.name = name;
            }
            if (email) {
                user.email = email;
            }
            yield user.save();
            return res.status(200).json(user);
        });
    }
    register_device_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { pushToken, deviceInfo } = req.body;
            if (!pushToken) {
                throw new http_exception_1.HttpException(400, "DEVICE_TOKEN_NOT_PROVIDED");
            }
            const user_device = yield user_device_1.UserDeviceModel.findOne({ user: user._id });
            if (user_device) {
                if (user_device.pushToken === pushToken) {
                    return res.sendStatus(204);
                }
                yield user_device.updateOne({ pushToken });
            }
            if (!user_device) {
                yield user_device_1.UserDeviceModel.create({
                    user: user._id,
                    pushToken,
                    deviceInfo,
                    lastActive: new Date(),
                });
            }
            return res.sendStatus(204);
        });
    }
}
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.UsersGetJourney),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "get_journey", null);
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.UsersGetFollowersInfo),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "get_followers_info", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.UsersFollow),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "follow", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.UsersUnfollow),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "unfollow", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.UsersCreateHealthy),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "create_healthy", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.UsersSelectTitle),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "select_title", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.UsersUpdateAvatar),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    (0, upload_decorator_1.Upload)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "update_avatar", null);
__decorate([
    (0, routes_decorator_1.Put)(generics_1.Endpoints.UsersUpdateProfile),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "update_profile", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.UsersRegisterDeviceToken),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "register_device_token", null);
exports.UsersRepositoryImpl = new UsersRepository();
