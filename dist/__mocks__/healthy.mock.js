"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_healthy_mock = void 0;
const faker_1 = require("@faker-js/faker");
const create_healthy_mock = (healthy) => (Object.assign({ body_fat: faker_1.faker.number.int({ min: 10, max: 30 }), weight: faker_1.faker.number.int({ min: 50, max: 100 }), height: faker_1.faker.number.int({ min: 150, max: 200 }) }, healthy));
exports.create_healthy_mock = create_healthy_mock;
