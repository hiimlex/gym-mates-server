import { BaseController } from "@core/base_controller";
import { AuthRepositoryImpl } from "@modules/auth";
import { Endpoints } from "types/generics";
import { ItemsRepositoryImpl } from "./items.repository";
import { upload, upload_key } from "@middlewares/upload.middleware";

export class ItemsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.ItemsCreateFigure,
			upload.array(upload_key),
			AuthRepositoryImpl.is_admin,
			ItemsRepositoryImpl.create_figure
		);
	}
}
