"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allow_virtuals = exports.timestamps = void 0;
exports.timestamps = {
    createdAt: "created_at",
    updatedAt: "updated_at",
};
exports.allow_virtuals = {
    toJson: {
        virtuals: true,
    },
};
