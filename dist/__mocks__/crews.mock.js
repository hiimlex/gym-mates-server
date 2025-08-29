"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_crew_mock = void 0;
const faker_1 = require("@faker-js/faker");
const collections_1 = require("../types/collections");
const create_crew_mock = (crew) => (Object.assign({ name: faker_1.faker.company.name(), code: faker_1.faker.string.alphanumeric(6).toUpperCase(), visibility: collections_1.CrewVisibility.Public, streak: [collections_1.CrewStreak.Weekly] }, crew));
exports.create_crew_mock = create_crew_mock;
