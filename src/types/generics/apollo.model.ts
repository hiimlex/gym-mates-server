import { IUserDocument, TUser } from "types/collections";

export interface IApolloContext {
	user: IUserDocument | null;
}