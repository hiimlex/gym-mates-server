import {
	AuthRepositoryImpl,
	CrewsRepositoryImpl,
	ItemsRepositoryImpl,
	MissionsRepositoryImpl,
	ShopRepositoryImpl,
	UsersRepositoryImpl,
	WorkoutsRepositoryImpl,
} from "../modules/";

export const routers = [
	AuthRepositoryImpl.router,
	UsersRepositoryImpl.router,
	CrewsRepositoryImpl.router,
	WorkoutsRepositoryImpl.router,
	ItemsRepositoryImpl.router,
	ShopRepositoryImpl.router,
	MissionsRepositoryImpl.router,
];
