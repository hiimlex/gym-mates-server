import { UsersModel, UsersTC } from "@modules/users";
import { schemaComposer } from "graphql-compose";
import { CrewsTC } from "./crews.tc";
import { CrewsModel } from "./crews.schema";

schemaComposer.createObjectTC({
	name: "MembersWithUser",
	fields: {
		_id: "MongoID!",
		joined_at: "Date",
		is_admin: "Boolean",
		user: UsersTC.getType(), // embedded User
	},
});

CrewsTC.addFields({
	members_w_user: {
		type: "[MembersWithUser]",
		async resolve(source, args, context) {
			const crew = await CrewsModel.findById(source._id);

			const members = crew?.members || [];

			const users = await UsersModel.find({
				_id: { $in: members.map((member) => member.user.toString()) },
			});

			const userMap = Object.fromEntries(
				users.map((u) => [u._id.toString(), u])
			);

			return members.map((m) => ({
				_id: m._id,
				joined_at: m.joined_at,
				is_admin: m.is_admin,
				user: userMap[m.user.toString()] || null,
			}));
		},
	},
});

CrewsTC.addRelation("white_list", {
	resolver: () => UsersTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source) => ({
			_id: { $in: (source.white_list || []).map((id) => id.toString) },
		}),
	},
	projection: { white_list: true },
});
