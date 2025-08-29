import { test_get_user_and_cookie } from "@test/test.helpers";
import { create_healthy_mock, create_user_mock } from "../../__mocks__";
import { Server } from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import { IUserDocument, TUser } from "types/collections";
import { ApiPrefix, Endpoints } from "types/generics";

// initiate the test server
const test_server = new Server();
test_server.setup();
const test_agent = supertest(test_server.app);

let mongo_server: MongoMemoryServer;
let mock_user: Partial<TUser>;
let mock_friend: Partial<TUser>;
let user: IUserDocument;
let friend: IUserDocument;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);

	const user_r = await test_get_user_and_cookie(test_agent);
	const friend_r = await test_get_user_and_cookie(test_agent);

	user = user_r.user;
	mock_user = user_r.mock_user;
	friend = friend_r.user;
	mock_friend = friend_r.mock_user;
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

describe("Users module", () => {
	
	// Should add follow from user
	describe("POST /users/healthy", () => {
		it("should create a healthy info", async () => {
			const healthy_info = create_healthy_mock({
				user: user._id,
			});

			const c_healthy_request = await test_agent
				.post(ApiPrefix + Endpoints.UsersCreateHealthy)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send(healthy_info);

			expect(c_healthy_request.statusCode).toBe(200);
			expect(c_healthy_request.body).toHaveProperty("weight");

			const { body: updated_user } = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(updated_user).toHaveProperty("healthy");
		});
	});

	// [ToTest] - PUT /users/update-avatar
	// [ToTest] - PUT /users/select-title
});
