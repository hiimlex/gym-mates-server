"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewsTC = exports.CrewQueries = exports.CrewMutations = void 0;
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const crews_schema_1 = require("./crews.schema");
const diacriticSensitiveRegex_1 = require("../../utils/diacriticSensitiveRegex");
const CrewsTC = (0, graphql_compose_mongoose_1.composeWithMongoose)(crews_schema_1.CrewsModel);
exports.CrewsTC = CrewsTC;
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
                const cleanedValue = (0, diacriticSensitiveRegex_1.diacriticSensitiveRegex)(value).toLocaleLowerCase();
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
exports.CrewQueries = CrewQueries;
const CrewMutations = {};
exports.CrewMutations = CrewMutations;
