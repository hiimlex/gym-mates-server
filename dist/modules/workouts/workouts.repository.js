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
exports.WorkoutsRepositoryImpl = void 0;
const http_exception_1 = require("../../core/http_exception");
const crews_1 = require("../crews");
const coin_helper_1 = require("../../utils/coin.helper");
const workout_helper_1 = require("../../utils/workout.helper");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const workouts_schema_1 = require("./workouts.schema");
const base_controller_1 = require("../../core/base_controller");
const routes_decorator_1 = require("../../decorators/routes.decorator");
const generics_1 = require("../../types/generics");
const upload_decorator_1 = require("../../decorators/upload.decorator");
const catch_error_1 = require("../../decorators/catch_error");
const is_authenticated_1 = require("../../decorators/is_authenticated");
class WorkoutsRepository extends base_controller_1.DecoratorController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = res.locals.user;
            const { title, date, type, duration } = req.body;
            const file = req.file;
            let shared_to = req.body.shared_to || [];
            let picture = undefined;
            if (file) {
                picture = {
                    public_id: file.filename,
                    url: file.path,
                };
            }
            const crews = yield crews_1.CrewsModel.find({
                _id: { $in: shared_to },
                "members.user": { $in: [user._id] },
            });
            if (!crews.length) {
                throw new http_exception_1.HttpException(400, "CREW_NOT_FOUND");
            }
            // [Rules] - Check crew rules, about
            // Paid at any time
            // Paid without picture
            // Gym focused
            // Future dates
            const workout_date = new Date(date);
            yield (0, workout_helper_1.validate_workout_rules)(crews, workout_date, (_a = picture === null || picture === void 0 ? void 0 : picture.url) !== null && _a !== void 0 ? _a : undefined, type);
            // [Validations] - Check if the workout date is in the past
            // and the user had lost streak
            // should recalculate the streak
            // from the previous lost streak date and the workout date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const is_past = workout_date < today;
            if (is_past) {
                yield (0, workout_helper_1.recalculate_user_streak)(user, res);
            }
            // [StreakSystem] - Update user streak count
            // check if has a registered workout on the same day
            const gte = new Date(workout_date);
            const lte = new Date(workout_date);
            const workout_in_day = yield workouts_schema_1.WorkoutsModel.findOne({
                user: user._id,
                date: {
                    $gte: gte.setHours(0, 0, 0, 0),
                    $lt: lte.setHours(23, 59, 59, 999),
                },
            });
            // Check crews streak system
            const crew_streaks = new Set(crews
                .map((c) => c.streak)
                .reduce((previous, current) => [...previous, ...(current || [])], []));
            const day_streak = (user.day_streak || 0) + 1;
            const { coins, receipt } = yield (0, coin_helper_1.calculate_coins)(crew_streaks, day_streak, workout_date);
            // Create workout
            const workout = yield workouts_schema_1.WorkoutsModel.create({
                user: user._id,
                title,
                picture,
                date,
                type,
                duration,
                shared_to: crews.map((crew) => crew._id),
                earned: !workout_in_day ? coins : 0,
                receipt: !workout_in_day ? receipt : undefined,
            });
            // [CoinSystem] - Add coins to the user for creating a workout
            // Update the user's streak and coins
            // if the user has no workout registered on the same day
            if (!workout_in_day) {
                yield user.updateOne({
                    day_streak,
                    coins: user.coins + coins,
                });
            }
            // // [TODO] [Notify] - Notify the crews about the PAID
            // // [Journey] - Add a journey event for the user
            const event = {
                _id: new mongoose_1.Types.ObjectId(),
                action: collections_1.JourneyEventAction.PAID,
                created_at: new Date(),
                schema: collections_1.JourneyEventSchemaType.Workout,
                data: {
                    workout,
                },
            };
            yield user.add_journey_event(event);
            yield user.add_workout(workout._id);
            return res.status(201).json(workout);
        });
    }
}
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.WorkoutsCreate),
    (0, catch_error_1.CatchError)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = res.locals.user;
        const old_streak_count = res.locals.old_streak_count;
        if (!!old_streak_count) {
            yield user.updateOne({
                day_streak: old_streak_count,
            });
        }
    })),
    (0, is_authenticated_1.IsAuthenticated)(),
    (0, upload_decorator_1.Upload)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkoutsRepository.prototype, "create", null);
const WorkoutsRepositoryImpl = new WorkoutsRepository();
exports.WorkoutsRepositoryImpl = WorkoutsRepositoryImpl;
