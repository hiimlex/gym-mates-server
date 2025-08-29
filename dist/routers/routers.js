"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routers = void 0;
const modules_1 = require("../modules/");
exports.routers = [
    modules_1.AuthRepositoryImpl.router,
    modules_1.UsersRepositoryImpl.router,
    modules_1.CrewsRepositoryImpl.router,
    modules_1.WorkoutsRepositoryImpl.router,
    modules_1.ItemsRepositoryImpl.router,
    modules_1.ShopRepositoryImpl.router,
];
