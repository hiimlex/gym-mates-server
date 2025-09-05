import mongoose from "mongoose";
import { AllAchievements, Missions } from "../db";
import { IAchievementDocument } from "../types/collections";
import { AchievementsModel } from "../modules/items";
import { link } from "joi";
import { MissionsModel } from "@modules/missions";
import { getChangedFields } from "@utils/check_updates";

async function create_all_missions() {
	try {
		const url =
			process.env.NODE_ENV === "production"
				? process.env.PROD_DB_URL
				: process.env.DB_URL;

		if (!url) throw new Error("Database URL not provided");

		await mongoose.connect(url);

		const created_achievements: IAchievementDocument[] = [];

		for (const achievement of AllAchievements) {
			const existing_achievement = await AchievementsModel.findById(
				achievement._id
			);

			if (!existing_achievement) {
				console.log(`⚠️ Achievement not exists, creating: ${achievement.key}`);
				const new_ach = await AchievementsModel.create(achievement);
				created_achievements.push(new_ach);
				continue;
			}

			const changedFields = getChangedFields(existing_achievement, achievement);

			if (Object.keys(changedFields).length === 0) {
				console.log(
					`⚠️ Achievement already up-to-date, skipping: ${achievement.key}`
				);
				created_achievements.push(existing_achievement);
				continue;
			}

			const updated_achievement = await AchievementsModel.findByIdAndUpdate(
				achievement._id,
				achievement,
				{ new: true }
			);

			if (!updated_achievement) {
				console.log(`❌ Failed to update achievement: ${achievement.key}`);
				continue;
			}
			console.log(`✅ Updated achievement: ${updated_achievement.key}`);
			created_achievements.push(updated_achievement);
		}

		for (const mission of Missions) {
			let existing_mission = await MissionsModel.findById(mission._id);

			if (!existing_mission) {
				console.log(`⚠️ Mission not exists, creating: ${mission.name}`);
				existing_mission = await MissionsModel.create(mission);
				continue;
			}

			const changedFields = getChangedFields(existing_mission, mission);

			if (Object.keys(changedFields).length === 0) {
				console.log(`⚠️ Mission already up-to-date, skipping: ${mission.name}`);
				continue;
			}

			// Link achievements to missions
			const linked_achievement = created_achievements.find(
				(ach) => mission.achievement.toString() === ach._id.toString()
			);

			if (!linked_achievement) {
				console.log(`❌ No linked achievement found for mission: ${mission.name}`);
				continue;
			}

			await MissionsModel.findByIdAndUpdate(existing_mission._id, mission, {
				new: true,
			});
			console.log(`✅ Updated mission: ${mission.name}`);
		}

		console.log("✅ All missions and achievements are updated successfully.");

		await mongoose.disconnect();
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

create_all_missions();
