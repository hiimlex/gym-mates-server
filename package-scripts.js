const { series, crossEnv } = require("nps-utils");

const ENV = process.env.NODE_ENV || "development";

module.exports = {
	scripts: {
		data: {
			missions: {
				create: series(
					crossEnv(
						`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/create_all_missions.ts`
					)
				),
				delete: series(
					crossEnv(
						`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/delete_all_missions.ts`
					)
				),
				update: series(
					crossEnv(
						`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/update_all_missions.ts`
					)
				),
			},
			skins: {
				create: series(
					crossEnv(
						`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/create_all_skins.ts`
					)
				),
				delete: series(
					crossEnv(
						`NODE_ENV=${ENV} ts-node -r tsconfig-paths/register src/scripts/delete_all_skins.ts`
					)
				),
			},
		},
	},
};
