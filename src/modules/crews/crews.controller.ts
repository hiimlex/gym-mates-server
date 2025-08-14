import { BaseController } from "@core/base_controller";
import { Endpoints, ValidateBody } from "types/generics";
import { CrewsRepositoryImpl } from "./crews.repository";
import { AuthRepositoryImpl } from "../auth";
import { validate_schema } from "@middlewares/validate_schema.middleware";
import { upload, upload_key } from "@middlewares/upload.middleware";

export class CrewsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.CrewsGetByCode,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.get_by_code
		);

		this.router.get(
			Endpoints.CrewsGetActivities,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.get_activities
		);

		this.router.get(
			Endpoints.CrewsGetActivitiesDays,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.get_activities_days
		);

		this.router.get(
			Endpoints.CrewsGetRank,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.get_rank
		);

		this.router.post(
			Endpoints.CrewsCreate,
			AuthRepositoryImpl.is_authenticated,
			validate_schema(ValidateBody.CreateCrew),
			upload.single(upload_key),
			CrewsRepositoryImpl.create
		);

		this.router.post(
			Endpoints.CrewsJoin,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.join
		);

		this.router.post(
			Endpoints.CrewsLeave,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.leave
		);

		this.router.post(
			Endpoints.CrewsAcceptMember,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.accept_member
		);

		this.router.post(
			Endpoints.CrewsKickMember,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.kick_member
		);

		this.router.post(
			Endpoints.CrewsRejectMember,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.reject_member
		);

		this.router.put(
			Endpoints.CrewsUpdateConfig,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.update_config
		);

		this.router.put(
			Endpoints.CrewsUpdateAdmins,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.update_admin
		);

		this.router.put(
			Endpoints.CrewsFavorite,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.favorite
		);

		this.router.put(
			Endpoints.CrewsUpdateBanner,
			AuthRepositoryImpl.is_authenticated,
			upload.single(upload_key),
			CrewsRepositoryImpl.update_banner
		);

		this.router.delete(
			Endpoints.CrewsDelete,
			AuthRepositoryImpl.is_authenticated,
			CrewsRepositoryImpl.delete
		);
	}
}
