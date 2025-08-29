"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemErrors = void 0;
var SystemErrors;
(function (SystemErrors) {
    // General
    SystemErrors["UNAUTHORIZED"] = "UNAUTHORIZED";
    SystemErrors["FORBIDDEN"] = "FORBIDDEN";
    // Auth
    SystemErrors["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    // Crew
    SystemErrors["CREW_NOT_FOUND"] = "CREW_NOT_FOUND";
    SystemErrors["ALREADY_MEMBER"] = "ALREADY_MEMBER";
    SystemErrors["ALREADY_IN_WHITELIST"] = "ALREADY_IN_WHITELIST";
    SystemErrors["INVALID_DATE"] = "INVALID_DATE";
    SystemErrors["FILE_NOT_PROVIDED"] = "FILE_NOT_PROVIDED";
    SystemErrors["CANNOT_LEAVE_CREW_OWNER"] = "CANNOT_LEAVE_CREW_OWNER";
    // Workout
    SystemErrors["INVALID_WORKOUT_DATE"] = "INVALID_WORKOUT_DATE";
    SystemErrors["WORKOUT_DATE_IN_FUTURE"] = "WORKOUT_DATE_IN_FUTURE";
    SystemErrors["WORKOUT_DATE_TOO_OLD"] = "WORKOUT_DATE_TOO_OLD";
    SystemErrors["CREW_RULES_VIOLATION"] = "CREW_RULES_VIOLATION";
    SystemErrors["WORKOUT_DATE_OLDER_THAN_CREW"] = "WORKOUT_DATE_OLDER_THAN_CREW";
    // User
    SystemErrors["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    SystemErrors["USER_NOT_A_MEMBER"] = "USER_NOT_A_MEMBER";
    SystemErrors["USER_NOT_IN_WHITELIST"] = "USER_NOT_IN_WHITELIST";
    SystemErrors["ALREADY_FOLLOWING"] = "ALREADY_FOLLOWING";
    SystemErrors["TITLE_NOT_FOUND"] = "TITLE_NOT_FOUND";
    SystemErrors["USER_DOES_NOT_OWN_ITEM"] = "USER_DOES_NOT_OWN_ITEM";
    SystemErrors["DEVICE_TOKEN_NOT_PROVIDED"] = "DEVICE_TOKEN_NOT_PROVIDED";
    // Journey
    SystemErrors["JOURNEY_NOT_FOUND"] = "JOURNEY_NOT_FOUND";
    // Shop
    SystemErrors["CART_IS_EMPTY"] = "CART_IS_EMPTY";
    SystemErrors["SOME_ITEMS_ALREADY_OWNED"] = "SOME_ITEMS_ALREADY_OWNED";
    SystemErrors["USER_NOT_MET_ITEMS_REQUIREMENTS"] = "USER_NOT_MET_ITEMS_REQUIREMENTS";
    SystemErrors["USER_DO_NOT_HAVE_ENOUGH_COINS"] = "USER_DO_NOT_HAVE_ENOUGH_COINS";
    SystemErrors["ITEM_NOT_FOUND"] = "ITEM_NOT_FOUND";
})(SystemErrors || (exports.SystemErrors = SystemErrors = {}));
