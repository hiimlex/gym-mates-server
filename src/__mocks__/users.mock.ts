import { TUser } from "types/collections";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

export const create_user_mock = (user?: Partial<TUser>): Partial<TUser> => ({
	name: faker.person.fullName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	coins: 0,
	created_at: new Date(),
	_id: new Types.ObjectId(),
	...user,
});
