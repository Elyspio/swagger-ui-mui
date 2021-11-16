module.exports = {
	roots: ["<rootDir>/tests"],
	testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|swagger).+(ts|tsx|js)"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
};
