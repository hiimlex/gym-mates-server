import { schemaComposer } from "graphql-compose";
import { composeWithMongoose } from "graphql-compose-mongoose";
import { IWorkoutDocument } from "types/collections";
import { WorkoutsModel } from "./workouts.schema";

const WorkoutsTC = composeWithMongoose<IWorkoutDocument>(WorkoutsModel);

const WorkoutQueries = {
	workoutById: WorkoutsTC.getResolver("findById"),
	workoutOne: WorkoutsTC.getResolver("findOne"),
	workouts: WorkoutsTC.getResolver("findMany")
		.addFilterArg({
			name: "earned_op",
			type: "OperatorsFilterInput",
			description: "Filter workouts by earned points using operators",
			query: (rawQuery, value) => {
				if (value) {
					const operators = Object.keys(value).reduce((acc, key) => {
						if (value[key] !== undefined) {
							(acc as any)[`$${key}`] = value[key];
						}
						return acc;
					}, {});

					rawQuery.earned = {
						...operators,
					};
				}
				return rawQuery;
			},
		})
		.addFilterArg({
			name: "range",
			type: "[Date]",
			description: "Filter workouts by date range",
			query: (rawQuery, value) => {
				if (value && value.length === 2) {
					const [start, end] = value;
					const gte = new Date(start);
					const lte = new Date(end);

					rawQuery.date = {
						$gte: gte.setHours(0, 0, 0, 0),
						$lt: lte.setHours(23, 59, 59, 999),
					};
				}
				return rawQuery;
			},
		})
		.addFilterArg({
			name: "from",
			type: "[MongoID]",
			description: "Filter workouts by user IDs",
			query: (rawQuery, value) => {
				if (value && value.length > 0) {
					rawQuery.user = { $in: value };
				}
				return rawQuery;
			},
		})
		.addSortArg({
			name: "DATE_ASC",
			value: { date: 1 },
			description: "Sort workouts by date in ascending order",
		})
		.addSortArg({
			name: "DATE_DESC",
			value: { date: -1 },
			description: "Sort workouts by date in descending order",
		}),
};

const WorkoutMutations = {};

export { WorkoutMutations, WorkoutQueries, WorkoutsTC };
