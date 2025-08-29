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
const __mocks__1 = require("../../__mocks__");
const app_1 = require("../../app");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const generics_1 = require("../../types/generics");
// initiate the test server
const test_server = new app_1.Server();
test_server.setup();
const test_agent = (0, supertest_1.default)(test_server.app);
let mongo_server;
let mock_user;
let mock_friend;
let user;
let friend;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    mongo_server = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo_server.getUri();
    yield mongoose_1.default.connect(uri);
    const user_r = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
    const friend_r = yield (0, test_helpers_1.test_get_user_and_cookie)(test_agent);
    user = user_r.user;
    mock_user = user_r.mock_user;
    friend = friend_r.user;
    mock_friend = friend_r.mock_user;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        yield collection.deleteMany({});
    }
    yield mongoose_1.default.disconnect();
    yield mongo_server.stop();
    yield test_server.stop();
}));
describe("Users module", () => {
    // Should add follow from user
    describe("POST /users/healthy", () => {
        it("should create a healthy info", () => __awaiter(void 0, void 0, void 0, function* () {
            const healthy_info = (0, __mocks__1.create_healthy_mock)({
                user: user._id,
            });
            const c_healthy_request = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.UsersCreateHealthy)
                .set("Authorization", `Bearer ${mock_user.access_token}`)
                .send(healthy_info);
            expect(c_healthy_request.statusCode).toBe(200);
            expect(c_healthy_request.body).toHaveProperty("weight");
            const { body: updated_user } = yield test_agent
                .get(generics_1.ApiPrefix + generics_1.Endpoints.AuthMe)
                .set("Authorization", `Bearer ${mock_user.access_token}`);
            expect(updated_user).toHaveProperty("healthy");
        }));
    });
    // [ToTest] - PUT /users/update-avatar
    // [ToTest] - PUT /users/select-title
});
