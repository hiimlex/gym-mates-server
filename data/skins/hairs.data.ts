import { Types } from "mongoose";
import {
	AchievementKeys,
	ItemCategory,
	SkinPiece,
	SkinSex,
	TSkin,
} from "../../src/types/collections";

const skin_hairs: TSkin[] = [
	{
		_id: new Types.ObjectId("68b251039672e707db4d9a86"),
		name: "Militar",
		category: ItemCategory.Skin,
		price: 20,
		requirements: [],
		piece: SkinPiece.hair,
		sex: SkinSex.male,
		slug: "h_militar",
	},
	// {
	// 	_id: new Types.ObjectId("68b25109662cbbc8d9742696"),
	// 	name: "Executive",
	// 	category: ItemCategory.Skin,
	// 	file: {},
	// 	preview: {},
	// 	price: 20,
	// 	requirements: [],
	// 	piece: SkinPiece.hair,
	// 	sex: SkinSex.male,
	// },
	// {
	// 	_id: new Types.ObjectId("68b262a32f571c23618b880c"),
	// 	name: "Mullet",
	// 	category: ItemCategory.Skin,
	// 	file: {},
	// 	preview: {},
	// 	price: 60,
	// 	requirements: [AchievementKeys.rich],
	// 	piece: SkinPiece.hair,
	// 	sex: SkinSex.male,
	// },
];

export default skin_hairs;
