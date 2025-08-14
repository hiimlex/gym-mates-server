import { test_get_user_and_cookie } from "@test/test.helpers";
import { create_healthy_mock, create_user_mock } from "__mocks__";
import { Server } from "app";
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
	describe("POST /users/friends/send-request", () => {
		it("should send a friend request", async () => {
			const friend_request = await test_agent
				.post(ApiPrefix + Endpoints.UsersSendFriendRequest)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({
					friend_id: friend._id,
				});

			expect(friend_request.statusCode).toBe(204);

			const { body: updated_friend } = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_friend.access_token}`);

			expect(updated_friend).toHaveProperty("requests");
			expect(updated_friend.requests).toContain(user._id);
		});
	});
	describe("POST /users/friends/accept-request", () => {
		it("should accept a friend request", async () => {
			const accept_request = await test_agent
				.post(ApiPrefix + Endpoints.UsersAcceptFriendRequest)
				.set("Authorization", `Bearer ${mock_friend.access_token}`)
				.send({
					friend_id: user._id,
				});

			expect(accept_request.statusCode).toBe(204);

			const { body: updated_user } = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(updated_user).toHaveProperty("friends");
			expect(updated_user.friends).toContain(friend._id);
			expect(updated_user.requests).not.toContain(friend._id);
		});
	});

	describe("POST /users/friends/remove", () => {
		it("should remove a friend", async () => {
			const remove_friend_request = await test_agent
				.post(ApiPrefix + Endpoints.UsersRemoveFriend)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({
					friend_id: friend._id,
				});

			expect(remove_friend_request.statusCode).toBe(204);
			const { body: updated_user } = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(updated_user.friends).not.toContain(friend._id);
			expect(updated_user.requests).not.toContain(friend._id);
		});
	});

	describe("POST /users/friends/reject-request", () => {
		it("should reject a friend request", async () => {
			const friend_request = await test_agent
				.post(ApiPrefix + Endpoints.UsersSendFriendRequest)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({
					friend_id: friend._id,
				});

			expect(friend_request.statusCode).toBe(204);

			const reject_request = await test_agent
				.post(ApiPrefix + Endpoints.UsersRejectFriendRequest)
				.set("Authorization", `Bearer ${mock_friend.access_token}`)
				.send({
					friend_id: user._id,
				});

			expect(reject_request.statusCode).toBe(204);

			const { body: updated_friend } = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_friend.access_token}`);

			expect(updated_friend.requests).not.toContain(user._id);
		});
	});

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
