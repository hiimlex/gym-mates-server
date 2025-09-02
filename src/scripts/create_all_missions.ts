import mongoose from "mongoose";
import { AllAchievements, Missions } from "../db";
import { IAchievementDocument } from "../types/collections";
import { AchievementsModel } from "../modules/items";
import { link } from "joi";
import { MissionsModel } from "@modules/missions";

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

			if (existing_achievement) {
				console.log(
					`⚠️ Achievement already exists, skipping: ${achievement.key}`
				);
				created_achievements.push(existing_achievement);
				continue;
			}

			const created_achievement = await AchievementsModel.create(achievement);

			if (!created_achievement) {
				console.log(`Failed to create achievement: ${achievement.key}`);
				continue;
			}

			created_achievements.push(created_achievement);

			console.log(`Created achievement: ${created_achievement.key}`);
		}

		for (const mission of Missions) {
			const existing_mission = await MissionsModel.findById(mission._id);

			if (existing_mission) {
				console.log(`⚠️ Mission already exists, skipping: ${mission.name}`);
				continue;
			}
			// Link achievements to missions
			const linked_achievement = created_achievements.find(
				(ach) => mission.achievement.toString() === ach._id.toString()
			);

			if (!linked_achievement) {
				console.log(`No linked achievement found for mission: ${mission.name}`);
				continue;
			}

			await MissionsModel.create(mission);
			console.log(`Created mission: ${mission.name}`);
		}

		console.log("✅ All missions and achievements created successfully.");

		await mongoose.disconnect();
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

create_all_missions();
