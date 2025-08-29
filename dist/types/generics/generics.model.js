"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPrefix = exports.AccessTokenCookie = exports.COOKIE_MAX_AGE = exports.JwtExpiresIn = exports.JwtSecret = exports.HashSalt = void 0;
exports.HashSalt = 10;
exports.JwtSecret = process.env.JWT_SECRET || "awesome_secret";
exports.JwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
exports.COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
exports.AccessTokenCookie = "access_token";
exports.ApiPrefix = process.env.API_PREFIX || "/api/v1";
