"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthyTC = exports.HealthyMutations = exports.HealthyQueries = void 0;
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const healthy_schema_1 = require("./healthy.schema");
const users_1 = require("../users");
const HealthyTC = (0, graphql_compose_mongoose_1.composeWithMongoose)(healthy_schema_1.HealthyModel);
exports.HealthyTC = HealthyTC;
HealthyTC.addRelation("user", {
    resolver: () => users_1.UsersTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.user.toString(),
    },
    projection: { user: true },
});
const HealthyQueries = {};
exports.HealthyQueries = HealthyQueries;
const HealthyMutations = {
    updateHealthyInfo: HealthyTC.getResolver("updateById"),
};
exports.HealthyMutations = HealthyMutations;
