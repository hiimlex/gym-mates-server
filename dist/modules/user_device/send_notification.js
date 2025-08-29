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
exports.sendPushNotification = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
let expo = new expo_server_sdk_1.Expo();
const sendPushNotification = (deviceTokens, message) => __awaiter(void 0, void 0, void 0, function* () {
    let messages = [];
    for (let pushToken of deviceTokens) {
        if (!expo_server_sdk_1.Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        messages.push({
            to: pushToken,
            sound: "default",
            body: message,
            data: { message },
        });
    }
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            let receipts = yield expo.sendPushNotificationsAsync(chunk);
            console.log(receipts);
        }
        catch (error) {
            console.error(error);
        }
    }
});
exports.sendPushNotification = sendPushNotification;
