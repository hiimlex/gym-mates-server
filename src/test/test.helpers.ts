import { create_user_mock } from "__mocks__";
import TestAgent from "supertest/lib/agent";
import { IUserDocument } from "types/collections";
import { ApiPrefix, Endpoints } from "types/generics";

export const test_get_user_and_cookie = async (
	test_agent: TestAgent
): Promise<{
	access_token: string;
	user: IUserDocument;
	mock_user: Partial<IUserDocument>;
}> => {
	const mock_user = create_user_mock();

	const { user, access_token } = (
		await test_agent.post(ApiPrefix + Endpoints.AuthSignUp).send({
			name: mock_user.name,
			email: mock_user.email,
			password: mock_user.password,
		})
	).body;

	mock_user.access_token = access_token;

	return {
		access_token,
		user,
		mock_user,
	};
};
