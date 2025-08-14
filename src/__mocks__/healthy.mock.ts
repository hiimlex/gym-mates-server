import { THealthy } from "types/collections";
import { faker } from "@faker-js/faker";

export const create_healthy_mock = (healthy?: Partial<THealthy>): Partial<THealthy> => ({
	body_fat: faker.number.int({ min: 10, max: 30 }),
	weight: faker.number.int({ min: 50, max: 100 }),
	height: faker.number.int({ min: 150, max: 200 }),
	...healthy,
});
