import { TAchievement } from "types/collections";
import Common from "./common.data";
import Rare from "./rare.data";
import Epic from "./epic.data";
import Legendary from "./legendary.data";

export const AllAchievements: TAchievement[] = [
	...Common,
	...Rare,
	...Epic,
	...Legendary,
];

export const AllAchievementsIds = AllAchievements.map((a) => a._id);
