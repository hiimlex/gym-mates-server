import winston from "winston";
import { MongoDB, MongoDBConnectionOptions } from "winston-mongodb";

const timezoneDate = () => {
	return new Date().toLocaleString("pt-BR", {
		timeZone: "America/Sao_Paulo",
	});
};

const sensitiveFields = ["password", "access_token"];

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),

	transports: [new winston.transports.Console()],
	exitOnError: false,
});

export function add_mongo_transport() {
	const transportOptions: MongoDBConnectionOptions = {
		db: process.env.DB_URL || "",
		level: "error",
		collection: "Logs",
		capped: true,
		cappedMax: 1000,
		format: winston.format.json(),
	};

	logger.add(new MongoDB(transportOptions));
}
