import { BaseController } from "@core/base_controller";
import { Endpoints, ValidateBody } from "types/generics";
import { AuthRepositoryImpl } from "./auth.repository";
import { upload, upload_key } from "@middlewares/upload.middleware";
import { validate_schema } from "@middlewares/validate_schema.middleware";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.AuthSignUp,
			validate_schema(ValidateBody.SignUp),
			upload.single(upload_key),
			AuthRepositoryImpl.sign_up
		);

		this.router.post(Endpoints.AuthLogin, AuthRepositoryImpl.login);

		this.router.get(
			Endpoints.AuthMe,
			AuthRepositoryImpl.is_authenticated,
			AuthRepositoryImpl.me
		);
	}
}
