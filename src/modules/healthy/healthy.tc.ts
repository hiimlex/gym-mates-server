import { composeWithMongoose } from "graphql-compose-mongoose";
import { HealthyModel } from "./healthy.schema";
import { UsersTC } from "@modules/users";
import { IHealthyDocument, IUserDocument } from "types/collections";

const HealthyTC = composeWithMongoose(HealthyModel);

HealthyTC.addRelation("user", {
	resolver: () => UsersTC.getResolver("findById"),
	prepareArgs: {
		_id: (source: IHealthyDocument) => source.user.toString(),
	},
	projection: { user: true },
})

const HealthyQueries = {};

const HealthyMutations = {
	updateHealthyInfo: HealthyTC.getResolver("updateById"),
};

export { HealthyQueries, HealthyMutations, HealthyTC };
