import { faker } from "@faker-js/faker";
import { CrewStreak, CrewVisibility, TCrew } from "types/collections";

export const create_crew_mock = (crew?: Partial<TCrew>): Partial<TCrew> => ({
	name: faker.company.name(),
	code: faker.string.alphanumeric(6).toUpperCase(),
	visibility: CrewVisibility.Public,
	streak: [CrewStreak.Weekly],
	...crew,
});
