import "reflect-metadata";

const ROUTES_KEY = Symbol("routes");

type RouteDefinition = {
	path: string;
	method: "get" | "post" | "put" | "delete";
	handlerName: string;
};

function createRouteDecorator(method: "get" | "post" | "put" | "delete") {
	return (path: string): MethodDecorator => {
		return (target, propertyKey) => {
			const routes: RouteDefinition[] =
				Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];

			routes.push({
				method,
				path,
				handlerName: propertyKey as string,
			});

			Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
		};
	};
}

export const Get = createRouteDecorator("get");
export const Post = createRouteDecorator("post");
export const Put = createRouteDecorator("put");
export const Delete = createRouteDecorator("delete");

export function getRoutes(target: any): RouteDefinition[] {
	return Reflect.getMetadata(ROUTES_KEY, target) || [];
}
