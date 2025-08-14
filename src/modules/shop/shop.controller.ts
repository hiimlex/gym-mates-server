import { BaseController } from "@core/base_controller";
import { AuthRepositoryImpl } from "@modules/auth";
import { Endpoints } from "types/generics";
import { ShopRepositoryImpl } from "./shop.repository";

export class ShopController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.ShopBuy,
			AuthRepositoryImpl.is_authenticated,
			ShopRepositoryImpl.buy
		);

		this.router.get(
			Endpoints.ShopListItems,
			AuthRepositoryImpl.is_authenticated,
			ShopRepositoryImpl.list_items
		)
	}
}
