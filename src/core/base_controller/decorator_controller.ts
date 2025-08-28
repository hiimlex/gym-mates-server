import { getRoutes } from "../../decorators/routes.decorator";
import { Router } from "express";

export abstract class DecoratorController {
	public router = Router();

	constructor() {
		this.register_routes();
	}

	private register_routes() {
		const routes = getRoutes(this.constructor);

		for (const route of routes) {
			const handler = (this as any)[route.handlerName].bind(this);

			console.log(
				`[Route] ${route.method.toUpperCase()} ${route.path} -> ${
					(this as any).constructor.name
				}.${route.handlerName}`
			);
			this.router[route.method](route.path, handler);
		}
	}
}
