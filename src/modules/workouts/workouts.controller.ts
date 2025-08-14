import { BaseController } from "@core/base_controller";
import { AuthRepositoryImpl } from "@modules/auth";
import { Endpoints, ValidateBody } from "types/generics";
import { WorkoutsRepositoryImpl } from "./workouts.repository";
import { validate_schema } from "@middlewares/validate_schema.middleware";
import { upload, upload_key } from "@middlewares/upload.middleware";

export class WorkoutsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.WorkoutsCreate,
			AuthRepositoryImpl.is_authenticated,
			validate_schema(ValidateBody.CreateWorkout),
			upload.single(upload_key),
			WorkoutsRepositoryImpl.create
		);
	}
}
