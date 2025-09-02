import { Types } from "mongoose";
import { TFile } from "./files.model";
import { TItem } from "./items.model";

export enum SkinSlug {
	h_militar = "h_militar",
	b_shorts = "b_shorts",
}

export const SkinIdBySlug: Record<SkinSlug, string> = {
	h_militar: "68b6f2dcd785643b529b5a52",
	b_shorts: "68b6f2e04e62c693eb7bd28b",
};

export enum SkinPiece {
	top = "top",
	bottom = "bottom",
	full = "full",
	boots = "boots",
	hair = "hair",
}

export enum SkinSex {
	male = "male",
	female = "female",
}

export type TSkin = TItem & {
	file?: TFile;
	preview?: TFile;
	piece: SkinPiece;
	sex: SkinSex;
	_id: Types.ObjectId;
	slug: SkinSlug;
};
