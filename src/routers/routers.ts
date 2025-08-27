import { ShopController } from "@modules/shop";
import {
	AuthController,
	CrewsController,
	ItemsController,
	UsersController,
	WorkoutsController,
} from "../modules/";

const auth_controller = new AuthController();
const crews_controller = new CrewsController();
const workouts_controller = new WorkoutsController();
const users_controller = new UsersController();
const shop_controller = new ShopController();
const items_controller = new ItemsController();

export const routers = [
	auth_controller.router,
	crews_controller.router,
	workouts_controller.router,
	items_controller.router,
	users_controller.router,
	shop_controller.router,
];
