const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths, {
			prefix: "<rootDir>/",
		}),
		"^@modules$": "<rootDir>/modules",
		"^types$": "<rootDir>/types",
		"^@core$": "<rootDir>/core",
		"^@utils$": "<rootDir>/utils",
		"^@test$": "<rootDir>/test",
	},
	modulePaths: ["<rootDir>"],
	setupFiles: ["<rootDir>/jest.setup.js"],
	testTimeout: 15000,
	coverageReporters: ["text", "text-summary"],
	forceExit: true,
};
