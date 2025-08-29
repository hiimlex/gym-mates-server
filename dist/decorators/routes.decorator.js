"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Put = exports.Post = exports.Get = void 0;
exports.getRoutes = getRoutes;
require("reflect-metadata");
const ROUTES_KEY = Symbol("routes");
function createRouteDecorator(method) {
    return (path) => {
        return (target, propertyKey) => {
            const routes = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
            routes.push({
                method,
                path,
                handlerName: propertyKey,
            });
            Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
        };
    };
}
exports.Get = createRouteDecorator("get");
exports.Post = createRouteDecorator("post");
exports.Put = createRouteDecorator("put");
exports.Delete = createRouteDecorator("delete");
function getRoutes(target) {
    return Reflect.getMetadata(ROUTES_KEY, target) || [];
}
