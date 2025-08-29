"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorController = void 0;
const routes_decorator_1 = require("../../decorators/routes.decorator");
const express_1 = require("express");
class DecoratorController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.register_routes();
    }
    register_routes() {
        const routes = (0, routes_decorator_1.getRoutes)(this.constructor);
        for (const route of routes) {
            const handler = this[route.handlerName].bind(this);
            console.log(`[Route] ${route.method.toUpperCase()} ${route.path} -> ${this.constructor.name}.${route.handlerName}`);
            this.router[route.method](route.path, handler);
        }
    }
}
exports.DecoratorController = DecoratorController;
