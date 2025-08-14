import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ApiPrefix, Endpoints } from "types/generics";
import { create_user_mock } from "../../__mocks__";
import { Server } from "../../app";
import supertest from "supertest";

const test_server = new Server();
test_server.setup();
const test_agent = supertest(test_server.app);

let mongo_server: MongoMemoryServer;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);
});

afterAll(async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}

	await mongoose.disconnect();
	await mongo_server.stop();
	await test_server.stop();
});

describe("Auth module", () => {
	const mock_user = create_user_mock();

	describe(`POST /auth/sign-up`, () => {
		it("should create an user", async () => {
			const { body: {user, access_token}, statusCode } = await test_agent
				.post(ApiPrefix + Endpoints.AuthSignUp)
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
		});
	});

	describe(`POST /auth/login`, () => {
		it("should login an user", async () => {
			const { statusCode, body } = await test_agent
				.post(ApiPrefix + Endpoints.AuthLogin)
				.send({
					email: mock_user.email,
					password: mock_user.password,
				});

			expect(statusCode).toBe(200);

			const access_token = body.access_token;
			mock_user.access_token = access_token;
			expect(access_token).toBeDefined();
		});
	});
	
	describe(`GET ${Endpoints.AuthMe}`, () => {
		it("should get an user by access cookie", async () => {
			const response = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("email");
			expect(response.body.email).toBe(mock_user.email);
		});
	});
});
