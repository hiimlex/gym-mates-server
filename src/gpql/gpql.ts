import { ApolloServer } from "@apollo/server";
import { schemaComposer } from "./composer";

export const create_apollo_server = async () => {
	try {
		const schema = schemaComposer.buildSchema();

		const server = new ApolloServer({
			schema,
		});

		await server.start();

		console.log("Apollo Server started successfully");

		return server;
	} catch (error) {
		console.error("Error creating Apollo Server:", error);
	}
};
