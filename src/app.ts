import { expressMiddleware } from "@as-integrations/express4";
import { connect_database } from "@config/connect_database";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { create_apollo_server } from "gpql/gpql";
import mongoose from "mongoose";
import { JwtSecret } from "types/generics";
import { routers } from "./routers/routers";
import { set_apollo_context } from "@middlewares/set_apollo_context.middleware";

export class Server {
	app!: Application;
	prefix = process.env.API_PREFIX || "/api/v1";
	db!: typeof mongoose;

	constructor() {}

	private init_routes() {
		for (const router of routers) {
			this.app.use(this.prefix, router);
		}
	}

	private set_middlewares() {
		this.app.use(json());
		this.app.use(
			cors({
				origin: "*",
			})
		);
		this.app.use(cookieParser(JwtSecret.toString()));
	}

	async setup() {
		this.app = express();

		const db = await connect_database();

		if (db) {
			this.db = db;
			console.log("Database connected successfully");
		}

		this.set_middlewares();

		this.init_routes();

		const apollo_server = await create_apollo_server();

		if (apollo_server) {
			this.app.use(
				"/graphql",
				cors({
					origin: "*",
				}),
				json(),
				expressMiddleware(
					apollo_server
					// ,{ context: set_apollo_context }
				)
			);
		}
	}

	start() {
		if (process.env.NODE_ENV !== "test") {
			const PORT = process.env.PORT || 8080;
			this.app.listen(PORT, () => {
				console.log(`Server is running on port ${PORT}`);
			});
		}
	}

	async stop() {
		if (this.db && this.db.connection.readyState !== 0) {
			await this.db.disconnect();
		}
	}
}
