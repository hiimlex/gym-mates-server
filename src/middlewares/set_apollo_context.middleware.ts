import { ContextFunction } from "@apollo/server";
import { ExpressContextFunctionArgument } from "@as-integrations/express4";
import { HttpException } from "@core/http_exception";
import { UsersModel } from "@modules/users";
import { decode } from "jsonwebtoken";
import { AccessTokenCookie, IApolloContext } from "types/generics";

export const set_apollo_context: ContextFunction<
	[ExpressContextFunctionArgument],
	IApolloContext
> = async ({ req }) => {
	const access_token =
		req.signedCookies[AccessTokenCookie] || req.cookies[AccessTokenCookie];

	if (!access_token) {
		throw new HttpException(401, "UNAUTHORIZED");
	}

	const decoded_token = decode(access_token);

	if (!decoded_token) {
		throw new HttpException(401, "UNAUTHORIZED");
	}

	const { id } = decoded_token as { id: string };

	const user = await UsersModel.findById(id);

	return { user };
};
