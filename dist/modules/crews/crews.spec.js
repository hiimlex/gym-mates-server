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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("../../test/test.helpers");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const collections_1 = require("../../types/collections");
const generics_1 = require("../../types/generics");
const __mocks__1 = require("../../__mocks__");
const app_1 = require("../../app");
const test_server = new app_1.Server();
test_server.setup();
const test_agent = (0, supertest_1.default)(test_server.app);
let mongo_server;
let mock_user;
let created_user;
let mock_crew;
let created_crew;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    mongo_server = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo_server.getUri();
    yield mongoose_1.default.connect(uri);
    const r = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
    mock_user = r.mock_user;
    created_user = r.user;
    mock_crew = (0, __mocks__1.create_crew_mock)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        yield collection.deleteMany();
    }
    yield mongoose_1.default.disconnect();
    yield mongo_server.stop();
}));
describe("Crews Module", () => {
    describe(`POST /crews/`, () => {
        it("should create a crew", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body, error } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsCreate)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send(mock_crew);
            created_crew = body;
            expect(statusCode).toBe(201);
            expect(body).toHaveProperty("name", mock_crew.name);
            expect(body).toHaveProperty("code", mock_crew.code);
        }));
    });
    describe(`GET /crews/get-by-code`, () => {
        it("should get a crew by code", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body } = yield test_agent
                .get(generics_1.ApiPrefix +
                generics_1.Endpoints.CrewsGetByCode.replace(":code", created_crew.code))
                .set("Authorization", `Bearer ${mock_user.access_token}`);
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("name", mock_crew.name);
            expect(body).toHaveProperty("code", mock_crew.code);
        }));
    });
    describe("GET /crews/get-rank", () => {
        it("Should get crew rank", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body } = yield test_agent
                .get(generics_1.ApiPrefix + generics_1.Endpoints.CrewsGetRank)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send({ crew_id: created_crew._id.toString() });
            expect(statusCode).toBe(200);
            expect(body).toBeDefined();
        }));
    });
    // [ToTest] - GET /crews/activities
    // [ToTest] - Get /crews/activities-days
    describe(`POST /crews/join`, () => {
        it("should join a member to a crew", () => __awaiter(void 0, void 0, void 0, function* () {
            const temp = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            const { statusCode, body } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: created_crew.code });
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("joined", true);
        }));
        it("should join whitelist if crew is private", () => __awaiter(void 0, void 0, void 0, function* () {
            const new_crew_user = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            const mock_new_crew = (0, __mocks__1.create_crew_mock)({
                visibility: collections_1.CrewVisibility.Private,
            });
            const new_crew = (yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsCreate)
                .set("Authorization", `Bearer ${new_crew_user.access_token}`)
                .send(mock_new_crew)).body;
            expect(new_crew).toBeDefined();
            const temp = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            expect(temp.user).toHaveProperty("_id");
            const { statusCode, body } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: new_crew.code });
            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("in_whitelist", true);
        }));
    });
    describe("POST /crews/accept-member", () => {
        it("should accept a member to a crew", () => __awaiter(void 0, void 0, void 0, function* () {
            const crew_owner = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            const mock_new_crew = (0, __mocks__1.create_crew_mock)({
                visibility: collections_1.CrewVisibility.Private,
            });
            const temp_crew = (yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsCreate)
                .set("Authorization", `Bearer ${crew_owner.access_token}`)
                .send(mock_new_crew)).body;
            expect(temp_crew).toBeDefined();
            const new_user = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            expect(new_user.user).toHaveProperty("_id");
            yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${new_user.access_token}`)
                .send({ code: temp_crew.code });
            const user_id = new_user.user._id.toString();
            const { statusCode } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsAcceptMember)
                .set("Authorization", `Bearer ${crew_owner.access_token}`)
                .send({ user_id, code: temp_crew.code });
            expect(statusCode).toBe(204);
        }));
    });
    describe("POST /crews/reject-member", () => {
        it("should reject member from crew whitelist", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a new crew with private visibility
            const crew_user = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            const mock_new_crew = (0, __mocks__1.create_crew_mock)({
                visibility: collections_1.CrewVisibility.Private,
            });
            const temp_crew = (yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsCreate)
                .set("Authorization", `Bearer ${crew_user.access_token}`)
                .send(mock_new_crew)).body;
            expect(temp_crew).toBeDefined();
            // Create a new user and join the crew
            const temp = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            expect(temp.user).toHaveProperty("_id");
            yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: temp_crew.code });
            const user_id = temp.user._id.toString();
            // Reject the member from the crew
            const { statusCode } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsRejectMember)
                .set("Authorization", `Bearer ${crew_user.access_token}`)
                .send({ user_id, code: temp_crew.code });
            expect(statusCode).toBe(204);
        }));
    });
    describe("PUT /crews/update-admins/", () => {
        it("should update admin status of a crew member", () => __awaiter(void 0, void 0, void 0, function* () {
            const temp = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            expect(temp.user).toHaveProperty("_id");
            yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: created_crew.code });
            const temp_user_id = temp.user._id;
            const { statusCode, body } = yield test_agent
                .put(generics_1.ApiPrefix + generics_1.Endpoints.CrewsUpdateAdmins)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send({
                user_id: temp_user_id,
                code: created_crew.code,
                set_admin: true,
            });
            expect(statusCode).toBe(204);
        }));
    });
    describe(`POST /crews/kick`, () => {
        it("should kick a member from a crew", () => __awaiter(void 0, void 0, void 0, function* () {
            const temp = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            expect(temp.user).toHaveProperty("_id");
            yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: created_crew.code });
            const temp_user_id = temp.user._id;
            const { statusCode } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsKickMember)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send({ user_id: temp_user_id, code: created_crew.code });
            expect(statusCode).toBe(204);
        }));
    });
    describe(`POST /crews/leave`, () => {
        it("should allow a user to leave a crew", () => __awaiter(void 0, void 0, void 0, function* () {
            const temp = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
            expect(temp.user).toHaveProperty("_id");
            yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsJoin)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: created_crew.code });
            const { statusCode } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.CrewsLeave)
                .set("Authorization", `Bearer ${temp.access_token}`)
                .send({ code: created_crew.code });
            expect(statusCode).toBe(204);
        }));
    });
    describe("PUT /crews/update-config/", () => {
        it("should update crew configuration", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const update_data = {
                visibility: collections_1.CrewVisibility.Public,
                rules: {
                    free_weekends: false,
                },
            };
            const { body } = yield test_agent
                .put(generics_1.ApiPrefix + generics_1.Endpoints.CrewsUpdateConfig)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send(Object.assign(Object.assign({}, update_data), { crew_id: created_crew._id.toString() }));
            expect(body).toHaveProperty("visibility", update_data.visibility);
            expect(body.rules).toHaveProperty("free_weekends", (_a = update_data.rules) === null || _a === void 0 ? void 0 : _a.free_weekends);
        }));
    });
    describe("PUT /crews/favorite", () => {
        it("should add a crew to user's favorites", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode } = yield test_agent
                .put(generics_1.ApiPrefix + generics_1.Endpoints.CrewsFavorite)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send({ crew_id: created_crew._id.toString() });
            const { body: updated_user } = yield test_agent
                .get(generics_1.ApiPrefix + generics_1.Endpoints.AuthMe)
                .set("Authorization", `Bearer ${mock_user.access_token}`);
            expect(statusCode).toBe(204);
            expect(updated_user).toHaveProperty("favorites");
            expect(updated_user.favorites).toContain(created_crew._id.toString());
        }));
    });
    describe("DELETE /crews/:id", () => {
        it("should delete a crew", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode } = yield test_agent
                .delete(generics_1.ApiPrefix +
                generics_1.Endpoints.CrewsDelete.replace(":id", created_crew._id.toString()))
                .set("Authorization", `Bearer ${mock_user.access_token}`);
            expect(statusCode).toBe(204);
        }));
    });
});
