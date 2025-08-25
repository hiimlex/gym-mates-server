import { BaseController } from "@core/base_controller";
import { AuthRepositoryImpl } from "@modules/auth";
import { Endpoints } from "types/generics";
import { UsersRepositoryImpl } from "./users.repository";
import { upload, upload_key } from "@middlewares/upload.middleware";

export class UsersController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.UsersGetJourney,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.get_journey
		);

		this.router.get(
			Endpoints.UsersGetFollowersInfo,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.get_followers_info
		);

		this.router.post(
			Endpoints.UsersFollow,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.follow
		);

		this.router.post(
			Endpoints.UsersUnfollow,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.unfollow
		);

		this.router.post(
			Endpoints.UsersCreateHealthy,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.create_healthy
		);

		this.router.post(
			Endpoints.UsersRegisterDeviceToken,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.register_device_token
		);

		this.router.put(
			Endpoints.UsersSelectTitle,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.select_title
		);

		this.router.put(
			Endpoints.UsersUpdateAvatar,
			AuthRepositoryImpl.is_authenticated,
			upload.single(upload_key),
			UsersRepositoryImpl.update_avatar
		);

		this.router.put(
			Endpoints.UsersUpdateProfile,
			AuthRepositoryImpl.is_authenticated,
			UsersRepositoryImpl.update_profile
		);
	}
}
