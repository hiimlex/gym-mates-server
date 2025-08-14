import { composeWithMongoose } from "graphql-compose-mongoose";
import { JourneyModel } from "./journey.schema";
import { IJourneyDocument } from "types/collections";

const JourneyTC = composeWithMongoose<IJourneyDocument>(JourneyModel);

const JourneyQueries = {
	journeyById: JourneyTC.getResolver("findById"),
};

const JourneyMutations = {
	updateJourneyById: JourneyTC.getResolver("updateById"),
};

export { JourneyMutations, JourneyQueries, JourneyTC };
