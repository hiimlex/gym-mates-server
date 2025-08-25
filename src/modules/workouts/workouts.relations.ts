import { UsersTC } from "@modules/users";
import { schemaComposer } from "graphql-compose";
import { WorkoutsTC } from "./workouts.tc";
import { CrewsTC } from "@modules/crews";

schemaComposer.createInputTC({
	name: "OperatorsFilterInput",
	fields: {
		gt: "Int",
		gte: "Int",
		lt: "Int",
		lte: "Int",
		eq: "Int",
		neq: "Int",
		in: "[Int]",
		nin: "[Int]",
	},
});

WorkoutsTC.addRelation("user", {
	resolver: () => UsersTC.getResolver("findById"),
	prepareArgs: {
		_id: (source) => source.user,
	},
	projection: { user: true }, // Provide the field to be projected
});

WorkoutsTC.addRelation("shared_to", {
	resolver: () => CrewsTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source) => ({
			_id: { $all: source.shared_to },
		}),
	},
	projection: { shared_to: true }, // Provide the field to be projected
});
