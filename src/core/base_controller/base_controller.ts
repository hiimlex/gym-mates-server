import { Router } from "express";

export abstract class BaseController {
	router = Router();

	constructor() {
		this.define_routes();
	}

	abstract define_routes(): void;
}
