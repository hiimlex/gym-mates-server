"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyTC = exports.JourneyQueries = exports.JourneyMutations = void 0;
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const journey_schema_1 = require("./journey.schema");
const JourneyTC = (0, graphql_compose_mongoose_1.composeWithMongoose)(journey_schema_1.JourneyModel);
exports.JourneyTC = JourneyTC;
const JourneyQueries = {
    journeyById: JourneyTC.getResolver("findById"),
};
exports.JourneyQueries = JourneyQueries;
const JourneyMutations = {
    updateJourneyById: JourneyTC.getResolver("updateById"),
};
exports.JourneyMutations = JourneyMutations;
