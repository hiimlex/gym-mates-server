"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_user_mock = void 0;
const faker_1 = require("@faker-js/faker");
const mongoose_1 = require("mongoose");
const create_user_mock = (user) => (Object.assign({ name: faker_1.faker.person.fullName(), email: faker_1.faker.internet.email(), password: faker_1.faker.internet.password(), coins: 0, created_at: new Date(), _id: new mongoose_1.Types.ObjectId() }, user));
exports.create_user_mock = create_user_mock;
