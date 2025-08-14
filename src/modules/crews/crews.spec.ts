import { test_get_user_and_cookie } from "@test/test.helpers";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { CrewVisibility, ICrewDocument, TCrew } from "types/collections";
import { IUserDocument } from "types/collections/users.model";
import { ApiPrefix, Endpoints } from "types/generics";
import { create_crew_mock } from "../../__mocks__";
import { Server } from "../../app";

const test_server = new Server();
test_server.setup();
const test_agent = request(test_server.app);
let mongo_server: MongoMemoryServer;
let mock_user: Partial<IUserDocument>;
let created_user: IUserDocument;
let mock_crew: Partial<TCrew>;
let created_crew: ICrewDocument;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);

	const r = await test_get_user_and_cookie(test_agent);
	mock_user = r.mock_user;
	created_user = r.user;

	mock_crew = create_crew_mock();
});

afterAll(async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany();
	}

	await mongoose.disconnect();
	await mongo_server.stop();
});

describe("Crews Module", () => {
	describe(`POST /crews/`, () => {
		it("should create a crew", async () => {
			const { statusCode, body, error } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsCreate)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send(mock_crew);

			created_crew = body;
			expect(statusCode).toBe(201);
			expect(body).toHaveProperty("name", mock_crew.name);
			expect(body).toHaveProperty("code", mock_crew.code);
		});
	});

	describe(`GET /crews/get-by-code`, () => {
		it("should get a crew by code", async () => {
			const { statusCode, body } = await test_agent
				.get(
					ApiPrefix +
						Endpoints.CrewsGetByCode.replace(":code", created_crew.code)
				)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(statusCode).toBe(200);
			expect(body).toHaveProperty("name", mock_crew.name);
			expect(body).toHaveProperty("code", mock_crew.code);
		});
	});

	describe("GET /crews/get-rank", () => {
		it("Should get crew rank", async () => {
			const { statusCode, body } = await test_agent
				.get(ApiPrefix + Endpoints.CrewsGetRank)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({ crew_id: created_crew._id.toString() });

			expect(statusCode).toBe(200);
			expect(body).toBeDefined();
		});
	});

	// [ToTest] - GET /crews/activities
	// [ToTest] - Get /crews/activities-days

	describe(`POST /crews/join`, () => {
		it("should join a member to a crew", async () => {
			const temp = await test_get_user_and_cookie(test_agent);

			const { statusCode, body } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: created_crew.code });

			expect(statusCode).toBe(200);
			expect(body).toHaveProperty("joined", true);
		});

		it("should join whitelist if crew is private", async () => {
			const new_crew_user = await test_get_user_and_cookie(test_agent);
			const mock_new_crew = create_crew_mock({
				visibility: CrewVisibility.Private,
			});

			const new_crew = (
				await test_agent
					.post(ApiPrefix + Endpoints.CrewsCreate)
					.set("Authorization", `Bearer ${new_crew_user.access_token}`)
					.send(mock_new_crew)
			).body;

			expect(new_crew).toBeDefined();

			const temp = await test_get_user_and_cookie(test_agent);

			expect(temp.user).toHaveProperty("_id");

			const { statusCode, body } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: new_crew.code });

			expect(statusCode).toBe(200);
			expect(body).toHaveProperty("in_whitelist", true);
		});
	});

	describe("POST /crews/accept-member", () => {
		it("should accept a member to a crew", async () => {
			const crew_owner = await test_get_user_and_cookie(test_agent);
			const mock_new_crew = create_crew_mock({
				visibility: CrewVisibility.Private,
			});

			const temp_crew = (
				await test_agent
					.post(ApiPrefix + Endpoints.CrewsCreate)
					.set("Authorization", `Bearer ${crew_owner.access_token}`)
					.send(mock_new_crew)
			).body;

			expect(temp_crew).toBeDefined();

			const new_user = await test_get_user_and_cookie(test_agent);

			expect(new_user.user).toHaveProperty("_id");

			await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${new_user.access_token}`)
				.send({ code: temp_crew.code });

			const user_id = new_user.user._id.toString();

			const { statusCode } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsAcceptMember)
				.set("Authorization", `Bearer ${crew_owner.access_token}`)
				.send({ user_id, code: temp_crew.code });

			expect(statusCode).toBe(204);
		});
	});

	describe("POST /crews/reject-member", () => {
		it("should reject member from crew whitelist", async () => {
			// Create a new crew with private visibility
			const crew_user = await test_get_user_and_cookie(test_agent);
			const mock_new_crew = create_crew_mock({
				visibility: CrewVisibility.Private,
			});

			const temp_crew = (
				await test_agent
					.post(ApiPrefix + Endpoints.CrewsCreate)
					.set("Authorization", `Bearer ${crew_user.access_token}`)
					.send(mock_new_crew)
			).body;

			expect(temp_crew).toBeDefined();

			// Create a new user and join the crew
			const temp = await test_get_user_and_cookie(test_agent);

			expect(temp.user).toHaveProperty("_id");

			await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: temp_crew.code });

			const user_id = temp.user._id.toString();

			// Reject the member from the crew
			const { statusCode } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsRejectMember)
				.set("Authorization", `Bearer ${crew_user.access_token}`)
				.send({ user_id, code: temp_crew.code });

			expect(statusCode).toBe(204);
		});
	});

	describe("PUT /crews/update-admins/", () => {
		it("should update admin status of a crew member", async () => {
			const temp = await test_get_user_and_cookie(test_agent);

			expect(temp.user).toHaveProperty("_id");

			await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: created_crew.code });

			const temp_user_id = temp.user._id;

			const { statusCode, body } = await test_agent
				.put(ApiPrefix + Endpoints.CrewsUpdateAdmins)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({
					user_id: temp_user_id,
					code: created_crew.code,
					set_admin: true,
				});

			expect(statusCode).toBe(204);
		});
	});

	describe(`POST /crews/kick`, () => {
		it("should kick a member from a crew", async () => {
			const temp = await test_get_user_and_cookie(test_agent);

			expect(temp.user).toHaveProperty("_id");

			await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: created_crew.code });

			const temp_user_id = temp.user._id;

			const { statusCode } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsKickMember)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({ user_id: temp_user_id, code: created_crew.code });

			expect(statusCode).toBe(204);
		});
	});

	describe(`POST /crews/leave`, () => {
		it("should allow a user to leave a crew", async () => {
			const temp = await test_get_user_and_cookie(test_agent);

			expect(temp.user).toHaveProperty("_id");

			await test_agent
				.post(ApiPrefix + Endpoints.CrewsJoin)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: created_crew.code });

			const { statusCode } = await test_agent
				.post(ApiPrefix + Endpoints.CrewsLeave)
				.set("Authorization", `Bearer ${temp.access_token}`)
				.send({ code: created_crew.code });

			expect(statusCode).toBe(204);
		});
	});

	describe("PUT /crews/update-config/", () => {
		it("should update crew configuration", async () => {
			const update_data: Partial<TCrew> = {
				visibility: CrewVisibility.Public,
				rules: {
					free_weekends: false,
				},
			};

			const { body } = await test_agent
				.put(ApiPrefix + Endpoints.CrewsUpdateConfig)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({ ...update_data, crew_id: created_crew._id.toString() });

			expect(body).toHaveProperty("visibility", update_data.visibility);
			expect(body.rules).toHaveProperty(
				"free_weekends",
				update_data.rules?.free_weekends
			);
		});
	});

	describe("PUT /crews/favorite", () => {
		it("should add a crew to user's favorites", async () => {
			const { statusCode } = await test_agent
				.put(ApiPrefix + Endpoints.CrewsFavorite)
				.set("Authorization", `Bearer ${mock_user.access_token}`)
				.send({ crew_id: created_crew._id.toString() });

			const { body: updated_user } = await test_agent
				.get(ApiPrefix + Endpoints.AuthMe)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(statusCode).toBe(204);
			expect(updated_user).toHaveProperty("favorites");
			expect(updated_user.favorites).toContain(created_crew._id.toString());
		});
	});

	describe("DELETE /crews/:id", () => {
		it("should delete a crew", async () => {
			const { statusCode } = await test_agent
				.delete(
					ApiPrefix +
						Endpoints.CrewsDelete.replace(":id", created_crew._id.toString())
				)
				.set("Authorization", `Bearer ${mock_user.access_token}`);

			expect(statusCode).toBe(204);
		});
	});
});
