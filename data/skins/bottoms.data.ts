import { Types } from "mongoose";
import {
	ItemCategory,
	SkinPiece,
	SkinSex,
	TSkin,
} from "../../src/types/collections";

const skin_bottoms: TSkin[] = [
	{
		_id: new Types.ObjectId("68b24ad123794735696853a6"),
		name: "Shorts",
		category: ItemCategory.Skin,
		price: 20,
		requirements: [],
		piece: SkinPiece.bottom,
		sex: SkinSex.male,
		slug: "b_shorts",
	},
];

export default skin_bottoms;
