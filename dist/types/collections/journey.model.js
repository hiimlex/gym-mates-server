"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyEventSchemaType = exports.JourneyEventAction = void 0;
var JourneyEventAction;
(function (JourneyEventAction) {
    JourneyEventAction["ADD"] = "add";
    JourneyEventAction["REMOVE"] = "remove";
    JourneyEventAction["UPDATE"] = "update";
    JourneyEventAction["BUY"] = "buy";
    JourneyEventAction["ACHIEVE"] = "achieve";
    JourneyEventAction["JOIN"] = "join";
    JourneyEventAction["LEAVE"] = "leave";
    JourneyEventAction["PAID"] = "paid";
    JourneyEventAction["LOSE_STREAK"] = "lose_streak";
    JourneyEventAction["START"] = "start";
    JourneyEventAction["FOLLOW"] = "follow";
})(JourneyEventAction || (exports.JourneyEventAction = JourneyEventAction = {}));
var JourneyEventSchemaType;
(function (JourneyEventSchemaType) {
    JourneyEventSchemaType["Healthy"] = "healthy";
    JourneyEventSchemaType["Workout"] = "workout";
    JourneyEventSchemaType["Item"] = "item";
    JourneyEventSchemaType["Friend"] = "friend";
    JourneyEventSchemaType["Crew"] = "crew";
    JourneyEventSchemaType["User"] = "user";
})(JourneyEventSchemaType || (exports.JourneyEventSchemaType = JourneyEventSchemaType = {}));
