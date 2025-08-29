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
const users_1 = require("../users");
const graphql_compose_1 = require("graphql-compose");
const crews_tc_1 = require("./crews.tc");
const crews_schema_1 = require("./crews.schema");
graphql_compose_1.schemaComposer.createObjectTC({
    name: "MembersWithUser",
    fields: {
        _id: "MongoID!",
        joined_at: "Date",
        is_admin: "Boolean",
        user: users_1.UsersTC.getType(), // embedded User
    },
});
crews_tc_1.CrewsTC.addFields({
    members_w_user: {
        type: "[MembersWithUser]",
        resolve(source, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const crew = yield crews_schema_1.CrewsModel.findById(source._id);
                const members = (crew === null || crew === void 0 ? void 0 : crew.members) || [];
                const users = yield users_1.UsersModel.find({
                    _id: { $in: members.map((member) => member.user.toString()) },
                });
                const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));
                return members.map((m) => ({
                    _id: m._id,
                    joined_at: m.joined_at,
                    is_admin: m.is_admin,
                    user: userMap[m.user.toString()] || null,
                }));
            });
        },
    },
});
crews_tc_1.CrewsTC.addRelation("white_list", {
    resolver: () => users_1.UsersTC.getResolver("findMany"),
    prepareArgs: {
        filter: (source) => ({
            _id: { $in: (source.white_list || []).map((id) => id.toString) },
        }),
    },
    projection: { white_list: true },
});
