const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths, {
			prefix: "<rootDir>/src/",
		}),
		"^@modules$": "<rootDir>/src/modules",
		"^types$": "<rootDir>/src/types",
		"^@core$": "<rootDir>/src/core",
		"^@utils$": "<rootDir>/src/utils",
		"^@test$": "<rootDir>/src/test",
	},
	modulePaths: ["<rootDir>/src"],
	setupFiles: ["<rootDir>/jest.setup.js"],
	testTimeout: 15000,
	coverageReporters: ["text", "text-summary"],
	forceExit: true,
};
