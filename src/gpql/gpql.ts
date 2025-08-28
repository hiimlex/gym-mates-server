import { ApolloServer } from "@apollo/server";
import { schemaComposer } from "./composer";

export const create_apollo_server = async () => {
	try {
		const schema = schemaComposer.buildSchema();

		const server = new ApolloServer({
			schema,
		});

		await server.start();

		return server;
	} catch (error) {
		console.error("Error creating Apollo Server:", error);
	}
};
