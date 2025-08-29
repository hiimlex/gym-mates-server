"use strict";
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
exports.validate_workout_rules = validate_workout_rules;
exports.recalculate_user_streak = recalculate_user_streak;
const http_exception_1 = require("../core/http_exception");
const journey_1 = require("../modules/journey");
const workouts_1 = require("../modules/workouts");
const collections_1 = require("../types/collections");
function validate_workout_rules(crews, workout_date, picture, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const cannot_pay_on_past_days = crews.some((crew) => { var _a; return !((_a = crew.rules) === null || _a === void 0 ? void 0 : _a.pay_on_past); });
            const cannot_pay_without_picture = crews.some((crew) => { var _a; return !((_a = crew.rules) === null || _a === void 0 ? void 0 : _a.pay_without_picture); });
            const gym_focused = crews.some((crew) => { var _a; return (_a = crew.rules) === null || _a === void 0 ? void 0 : _a.gym_focused; });
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const is_past = workout_date < today;
            if (is_past && cannot_pay_on_past_days) {
                reject(new http_exception_1.HttpException(400, "CREW_RULES_VIOLATION", {
                    paid_at_anytime: false,
                    crews: crews.filter((crew) => { var _a; return !((_a = crew.rules) === null || _a === void 0 ? void 0 : _a.pay_on_past); }),
                }));
            }
            if (!picture && cannot_pay_without_picture) {
                reject(new http_exception_1.HttpException(400, "CREW_RULES_VIOLATION", {
                    paid_without_picture: false,
                    crews: crews.filter((crew) => { var _a; return !((_a = crew.rules) === null || _a === void 0 ? void 0 : _a.pay_without_picture); }),
                }));
            }
            if (gym_focused && type !== collections_1.WorkoutType.Gym) {
                reject(new http_exception_1.HttpException(400, "CREW_RULES_VIOLATION", {
                    gym_focused: true,
                    crews: crews.filter((crew) => { var _a; return (_a = crew.rules) === null || _a === void 0 ? void 0 : _a.gym_focused; }),
                }));
            }
            // Validating workout date
            // check if the workout date is at least two days in the past
            if (workout_date < new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)) {
                reject(new http_exception_1.HttpException(400, "WORKOUT_DATE_TOO_OLD"));
            }
            // check if the workout date is in the future
            if (workout_date > new Date()) {
                reject(new http_exception_1.HttpException(400, "WORKOUT_DATE_IN_FUTURE"));
            }
            // check if the workout date is older than crew created date
            const crew_created_dates = crews.map((crew) => !!crew.created_at && new Date(crew.created_at));
            const oldest_crew_date = new Date(Math.min(...crew_created_dates.map((date) => date.getTime())));
            if (workout_date < oldest_crew_date) {
                reject(new http_exception_1.HttpException(400, "WORKOUT_DATE_OLDER_THAN_CREW"));
            }
            resolve();
        });
    });
}
function recalculate_user_streak(user, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user_has_streak = (user.day_streak || 0) > 0;
            const user_workouts = yield workouts_1.WorkoutsModel.find({
                user: user._id,
            });
            if (user_has_streak || user_workouts.length === 0) {
                resolve();
                return;
            }
            const journey = yield journey_1.JourneyModel.findOne({
                user: user._id,
            });
            if (!journey) {
                reject(new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND"));
            }
            const lost_streak_at = (_a = journey === null || journey === void 0 ? void 0 : journey.events) === null || _a === void 0 ? void 0 : _a.filter((event) => {
                if (event.action === collections_1.JourneyEventAction.LOSE_STREAK) {
                    return event;
                }
            });
            if (!lost_streak_at || (lost_streak_at === null || lost_streak_at === void 0 ? void 0 : lost_streak_at.length) === 0) {
                resolve();
                return;
            }
            let streak_count_start_date = undefined;
            let streak_count_end_date = undefined;
            let last_lost_streak_event = undefined;
            if (lost_streak_at && lost_streak_at.length < 2) {
                const last_event = lost_streak_at[0];
                streak_count_end_date = new Date(last_event.created_at);
                streak_count_start_date = new Date(user.created_at);
                last_lost_streak_event = last_event;
            }
            if (lost_streak_at && lost_streak_at.length >= 2) {
                const first_event = lost_streak_at[0];
                const second_event = lost_streak_at[1];
                streak_count_end_date = new Date(second_event.created_at);
                streak_count_start_date = new Date(first_event.created_at);
                last_lost_streak_event = first_event;
            }
            // [TODO] - Get the workouts between the dates to recalculate the streak
            const workouts = yield workouts_1.WorkoutsModel.find({
                user: user._id,
                date: {
                    $gte: streak_count_start_date === null || streak_count_start_date === void 0 ? void 0 : streak_count_start_date.setHours(0, 0, 0, 0),
                    $lt: streak_count_end_date === null || streak_count_end_date === void 0 ? void 0 : streak_count_end_date.setHours(23, 59, 59, 999),
                },
            });
            const streak_count = workouts.length;
            res.locals.old_streak_count = user.day_streak || 0;
            user.day_streak = streak_count;
            yield user.save();
            // [TODO] - Remove the last streak event from journey
            if (last_lost_streak_event) {
                yield journey_1.JourneyModel.updateOne({ _id: user.journey }, {
                    $pull: {
                        events: {
                            _id: last_lost_streak_event._id,
                        },
                    },
                });
            }
            resolve();
        }));
    });
}
