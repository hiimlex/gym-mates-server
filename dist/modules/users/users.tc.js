"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersTC = exports.UserQueries = exports.UserMutations = void 0;
const healthy_1 = require("../healthy");
const items_1 = require("../items");
const journey_1 = require("../journey");
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const users_schema_1 = require("./users.schema");
const crews_1 = require("../crews");
const UsersTC = (0, graphql_compose_mongoose_1.composeWithMongoose)(users_schema_1.UsersModel, {
    fields: { remove: ["password", "access_token"] },
});
exports.UsersTC = UsersTC;
UsersTC.addRelation("followers", {
    resolver: () => UsersTC.getResolver("findMany"),
    prepareArgs: {
        filter: (source) => ({
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
    resolver: () => journey_1.JourneyTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => { var _a; return (_a = source.journey) === null || _a === void 0 ? void 0 : _a.toString(); },
    },
    projection: { journey: true },
});
UsersTC.addRelation("healthy", {
    resolver: () => healthy_1.HealthyTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => { var _a; return (_a = source.healthy) === null || _a === void 0 ? void 0 : _a.toString(); },
    },
    projection: { healthy: true },
});
UsersTC.addRelation("title", {
    resolver: () => items_1.TitlesTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => { var _a; return (_a = source.title) === null || _a === void 0 ? void 0 : _a.toString(); },
    },
    projection: { title: true },
});
UsersTC.addFields({
    crews_count: {
        type: "Int",
        resolve: (source) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = source._id;
            return crews_1.CrewsModel.countDocuments({
                "members.user": userId,
            });
        }),
        description: "Number of groups this user is a member of",
    },
});
const UserQueries = {
    userById: UsersTC.getResolver("findById"),
    userOne: UsersTC.getResolver("findOne"),
    users: UsersTC.getResolver("findMany"),
};
exports.UserQueries = UserQueries;
const UserMutations = {
    updateUserById: UsersTC.getResolver("updateById"),
};
exports.UserMutations = UserMutations;
