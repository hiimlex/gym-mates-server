import { composeWithMongoose } from "graphql-compose-mongoose";
import { ICrewDocument } from "types/collections";
import { UsersModel, UsersTC } from "../users";
import { CrewsModel } from "./crews.schema";
import { schemaComposer } from "graphql-compose";
import { diacriticSensitiveRegex } from "@utils/diacriticSensitiveRegex";

const CrewsTC = composeWithMongoose<ICrewDocument>(CrewsModel);

const CrewQueries = {
	crews: CrewsTC.getResolver("findMany")
		.addFilterArg({
			type: "[MongoID]",
			name: "userId",
			description: "Filter by member IDs",
			query: (query, value) => {
				if (value && value.length > 0) {
					query.members = { $elemMatch: { user: { $in: value } } };
				}
				return query;
			},
		})
		.addFilterArg({
			name: "favorites",
			type: "[MongoID]",
			description: "Sort by favorite crews",
			query: (query, value) => {
				if (value && value.length > 0) {
					query._id = { $in: value };
				}
				return query;
			},
		})
		.addFilterArg({
			type: "String",
			name: "search",
			description: "Search by crew name or code ",
			query: (query, value) => {
				if (value) {
					const cleanedValue =
						diacriticSensitiveRegex(value).toLocaleLowerCase();

					query.$or = [
						{ name: { $regex: cleanedValue, $options: "i" } },
						{ code: { $regex: cleanedValue, $options: "i" } },
					];
				}
				return query;
			},
		}),
	crewById: CrewsTC.getResolver("findById"),
	crewOne: CrewsTC.getResolver("findOne"),
};

const CrewMutations = {};

export { CrewMutations, CrewQueries, CrewsTC };
