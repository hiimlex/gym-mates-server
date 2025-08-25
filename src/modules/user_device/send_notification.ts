import { Expo } from "expo-server-sdk";

let expo = new Expo();

export const sendPushNotification = async (deviceTokens: string[], message: string) => {
	let messages = [];
	for (let pushToken of deviceTokens) {
		if (!Expo.isExpoPushToken(pushToken)) {
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

	for(let chunk of chunks) {
		try {
			let receipts = await expo.sendPushNotificationsAsync(chunk);
			console.log(receipts);
		} catch (error) {
			console.error(error);
		}
	}
};
