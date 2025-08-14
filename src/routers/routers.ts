import { ShopController } from "@modules/shop";
import {
	AuthController,
	CrewsController,
	UsersController,
	WorkoutsController,
} from "../modules/";

const auth_controller = new AuthController();
const crews_controller = new CrewsController();
const workouts_controller = new WorkoutsController();
const users_controller = new UsersController();
const shop_controller = new ShopController();

export const routers = [
	auth_controller.router,
	crews_controller.router,
	workouts_controller.router,
	users_controller.router,
	shop_controller.router,
];
