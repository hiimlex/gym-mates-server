const { series, crossEnv } = require("nps-utils");

const ENV = process.env.NODE_ENV || "development";

module.exports = {
	scripts: {
		data: {
			createAllMissions: series(
				crossEnv(
					`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/create_all_missions.ts`
				)
			),
			deleteAllMissions: series(
				crossEnv(
					`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/delete_all_missions.ts`
				)
			),
			createAllSkins: series(
				crossEnv(
					`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/create_all_skins.ts`
				)
			),
			deleteAllSkins: series(
				crossEnv(
					`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/delete_all_skins.ts`
				)
			),
		},
	},
};
