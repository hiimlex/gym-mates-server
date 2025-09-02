import { Types } from "mongoose";
import {
	ItemCategory,
	SkinIdBySlug,
	SkinPiece,
	SkinSex,
	SkinSlug,
	TSkin,
} from "types/collections";

const skin_bottoms: TSkin[] = [
	{
		_id: new Types.ObjectId(SkinIdBySlug[SkinSlug.b_shorts]),
		name: "Shorts",
		category: ItemCategory.Skin,
		price: 20,
		requirements: [],
		piece: SkinPiece.bottom,
		sex: SkinSex.male,
		slug: SkinSlug.b_shorts,
	},
];

export default skin_bottoms;
