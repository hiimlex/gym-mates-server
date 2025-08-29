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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const generics_1 = require("../../types/generics");
const __mocks__1 = require("../../__mocks__");
const app_1 = require("../../app");
const supertest_1 = __importDefault(require("supertest"));
const test_server = new app_1.Server();
test_server.setup();
const test_agent = (0, supertest_1.default)(test_server.app);
let mongo_server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    mongo_server = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo_server.getUri();
    yield mongoose_1.default.connect(uri);
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
describe("Auth module", () => {
    const mock_user = (0, __mocks__1.create_user_mock)();
    describe(`POST /auth/sign-up`, () => {
        it("should create an user", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body: { user, access_token }, statusCode } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.AuthSignUp)
                .send({
                name: mock_user.name,
                email: mock_user.email,
                password: mock_user.password,
            });
            expect(statusCode).toBe(201);
            expect(access_token).toBeDefined();
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("_id");
            expect(user).not.toHaveProperty("password");
        }));
    });
    describe(`POST /auth/login`, () => {
        it("should login an user", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body } = yield test_agent
                .post(generics_1.ApiPrefix + generics_1.Endpoints.AuthLogin)
                .send({
                email: mock_user.email,
                password: mock_user.password,
            });
            expect(statusCode).toBe(200);
            const access_token = body.access_token;
            mock_user.access_token = access_token;
            expect(access_token).toBeDefined();
        }));
    });
    describe(`GET ${generics_1.Endpoints.AuthMe}`, () => {
        it("should get an user by access cookie", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield test_agent
                .get(generics_1.ApiPrefix + generics_1.Endpoints.AuthMe)
                .set("Authorization", `Bearer ${mock_user.access_token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("email");
            expect(response.body.email).toBe(mock_user.email);
        }));
    });
});
