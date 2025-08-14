import { CrewMutations, CrewQueries } from "@modules/crews";
import { HealthyMutations, HealthyQueries } from "@modules/healthy";
import { ItemsMutations, ItemsQueries } from "@modules/items";
import { JourneyMutations, JourneyQueries } from "@modules/journey";
import { UserMutations, UserQueries, UsersTC } from "@modules/users";
import { WorkoutMutations, WorkoutQueries } from "@modules/workouts";
import { SchemaComposer } from "graphql-compose";

// Initialize the schema composer
const schemaComposer = new SchemaComposer();

// Add queries and mutations to the schema composer
schemaComposer.Query.addFields({
	...UserQueries,
	...CrewQueries,
	...WorkoutQueries,
	...JourneyQueries,
	...HealthyQueries,
	...ItemsQueries,
});
schemaComposer.Mutation.addFields({
	...UserMutations,
	...CrewMutations,
	...WorkoutMutations,
	...JourneyMutations,
	...HealthyMutations,
	...ItemsMutations,
});

export { schemaComposer };
