import { HealthyTC } from "@modules/healthy";
import { TitlesTC } from "@modules/items";
import { JourneyTC } from "@modules/journey";
import { composeWithMongoose } from "graphql-compose-mongoose";
import { IUserDocument } from "types/collections";
import { UsersModel } from "./users.schema";
import { CrewsModel } from "@modules/crews";

const UsersTC = composeWithMongoose<IUserDocument>(UsersModel, {
	fields: { remove: ["password", "access_token"] },
});

UsersTC.addRelation("followers", {
	resolver: () => UsersTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source: IUserDocument) => ({
			_id: { $in: (source.followers || []).map((id) => id.toString()) },
		}),
	},
	projection: { followers: true },
});

UsersTC.addRelation("following", {
	resolver: () => UsersTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source) => ({
			_id: { $in: (source.following || []).map((id) => id.toString()) },
		}),
	},
	projection: { following: true },
});

UsersTC.addRelation("journey", {
	resolver: () => JourneyTC.getResolver("findById"),
	prepareArgs: {
		_id: (source) => source.journey?.toString(),
	},
	projection: { journey: true },
});

UsersTC.addRelation("healthy", {
	resolver: () => HealthyTC.getResolver("findById"),
	prepareArgs: {
		_id: (source) => source.healthy?.toString(),
	},
	projection: { healthy: true },
});

UsersTC.addRelation("title", {
	resolver: () => TitlesTC.getResolver("findById"),
	prepareArgs: {
		_id: (source) => source.title?.toString(),
	},
	projection: { title: true },
});

UsersTC.addFields({
	crews_count: {
		type: "Int",
		resolve: async (source) => {
			const userId = source._id;
			return CrewsModel.countDocuments({
				"members.user": userId,
			});
		},
		description: "Number of groups this user is a member of",
	},
});

const UserQueries = {
	userById: UsersTC.getResolver("findById"),
	userOne: UsersTC.getResolver("findOne"),
	users: UsersTC.getResolver("findMany"),
};

const UserMutations = {
	updateUserById: UsersTC.getResolver("updateById"),
};

export { UserMutations, UserQueries, UsersTC };
