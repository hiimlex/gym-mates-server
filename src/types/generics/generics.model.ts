import { Secret, SignOptions } from "jsonwebtoken";

export const HashSalt = 10;

export const JwtSecret: Secret =
	(process.env.JWT_SECRET as string) || "awesome_secret";
export const JwtExpiresIn: SignOptions["expiresIn"] =
	(process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";

export const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
export const AccessTokenCookie = "access_token";

export const ApiPrefix = process.env.API_PREFIX || "/api/v1";