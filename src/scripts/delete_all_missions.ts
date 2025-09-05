import { AchievementsModel } from "@modules/items";
import { MissionsModel } from "@modules/missions";
import mongoose from "mongoose";
import { AllAchievementsIds, MissionsIds } from "@db/data";

async function delete_all_missions() {
	try {
		const url =
			process.env.NODE_ENV === "production"
				? process.env.PROD_DB_URL
				: process.env.DB_URL;

		if (!url) throw new Error("Database URL not provided");

		await mongoose.connect(url);

		for(const achievement_id of AllAchievementsIds){
			const achievement = await AchievementsModel.findById(achievement_id);
			
			if(!achievement){
				console.log(`⚠️ Achievement with ID ${achievement_id} not found.`);
				continue;
			}

			await achievement.deleteOne();

			console.log(`✅ Deleted achievement ${achievement.key}.`);
		}

		for (const mission_id of MissionsIds) {
			const mission = await MissionsModel.findById(mission_id);

			if (!mission) {
				console.log(`Mission with ID ${mission_id} not found.`);
				continue;
			}

			await mission.deleteOne();

			console.log(
				`Deleted mission: ${mission.name} and its linked achievement.`
			);
		}
		console.log(
			"✅ All missions and achievements deleted successfully."
		);
		await mongoose.disconnect();
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

delete_all_missions();
