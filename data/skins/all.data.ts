import { TSkin } from "../../src/types/collections";

import bottoms from "./bottoms.data";
import tops from "./tops.data";
import hairs from "./hairs.data";
import full_body from "./full_body.data";
import boots from "./boots.data";

export const AllSkins: TSkin[] = [
	...hairs,
	...tops,
	...bottoms,
	...full_body,
	...boots,
];

export const AllSkinsIds = AllSkins.map((skin) => skin._id.toString());