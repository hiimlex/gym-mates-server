"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../users");
const graphql_compose_1 = require("graphql-compose");
const workouts_tc_1 = require("./workouts.tc");
const crews_1 = require("../crews");
graphql_compose_1.schemaComposer.createInputTC({
    name: "OperatorsFilterInput",
    fields: {
        gt: "Int",
        gte: "Int",
        lt: "Int",
        lte: "Int",
        eq: "Int",
        neq: "Int",
        in: "[Int]",
        nin: "[Int]",
    },
});
workouts_tc_1.WorkoutsTC.addRelation("user", {
    resolver: () => users_1.UsersTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: true }, // Provide the field to be projected
});
workouts_tc_1.WorkoutsTC.addRelation("shared_to", {
    resolver: () => crews_1.CrewsTC.getResolver("findMany"),
    prepareArgs: {
        filter: (source) => ({
            _id: { $all: source.shared_to },
        }),
    },
    projection: { shared_to: true }, // Provide the field to be projected
});
