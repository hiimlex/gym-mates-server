"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaComposer = void 0;
const crews_1 = require("../modules/crews");
const healthy_1 = require("../modules/healthy");
const items_1 = require("../modules/items");
const journey_1 = require("../modules/journey");
const users_1 = require("../modules/users");
const workouts_1 = require("../modules/workouts");
const graphql_compose_1 = require("graphql-compose");
// Initialize the schema composer
const schemaComposer = new graphql_compose_1.SchemaComposer();
exports.schemaComposer = schemaComposer;
// Add queries and mutations to the schema composer
schemaComposer.Query.addFields(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, users_1.UserQueries), crews_1.CrewQueries), workouts_1.WorkoutQueries), journey_1.JourneyQueries), healthy_1.HealthyQueries), items_1.ItemsQueries));
schemaComposer.Mutation.addFields(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, users_1.UserMutations), crews_1.CrewMutations), workouts_1.WorkoutMutations), journey_1.JourneyMutations), healthy_1.HealthyMutations), items_1.ItemsMutations));
