import { HttpException } from "@core/http_exception";
import { AchievementsModel, ItemsModel } from "@modules/items";
import { diacriticSensitiveRegex } from "@utils/diacriticSensitiveRegex";
import { CatchError } from "../../decorators/catch_error";
import { Request, Response } from "express";
import { RootFilterQuery, SortOrder, Types } from "mongoose";
import {
	AchievementKeys,
	IItemDocument,
	IJourneyDocument,
	ItemCategory,
	IUserDocument,
	JourneyEventAction,
	JourneyEventSchemaType,
	TJourneyEvent,
} from "types/collections";
import { DecoratorController } from "@core/base_controller";
import { Get, Post } from "../../decorators/routes.decorator";
import { Endpoints } from "types/generics";
import { IsAuthenticated } from "../../decorators/is_authenticated";

class ShopRepository extends DecoratorController {
	@Post(Endpoints.ShopBuy)
	@CatchError()
	@IsAuthenticated()
	protected async buy(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const journey: IJourneyDocument = res.locals.journey;

		const cart = req.body.cart || [];

		if (!cart || !Array.isArray(cart) || cart.length === 0) {
			throw new HttpException(400, "CART_IS_EMPTY");
		}

		const items = await ItemsModel.find({
			_id: { $in: cart },
		});

		// Check if user has none of the items in the cart
		const has_items = items.some((bi) =>
			journey.inventory.some(
				(ji) => ji.item._id.toString() === bi._id.toString()
			)
		);

		if (has_items) {
			throw new HttpException(400, "SOME_ITEMS_ALREADY_OWNED");
		}

		// Check item requirements
		const items_requirements = items.map((item) => item.requirements).flat();

		// If item has requirements, check if the user has them
		if (items_requirements.length > 0) {
			const achievements = await user.get_achievements();
			const user_achievements = achievements.map((achievement) =>
				achievement.key.toString()
			);

			const user_met_requirements = items_requirements.every((req) =>
				user_achievements.includes(req)
			);

			if (!user_met_requirements) {
				throw new HttpException(400, "USER_NOT_MET_ITEMS_REQUIREMENTS");
			}
		}

		// Check if the user has enough coins
		const total_price = items.reduce((acc, item) => acc + item.price, 0);
		const user_coins = user.coins;
		if (user_coins < total_price) {
			throw new HttpException(400, "USER_DO_NOT_HAVE_ENOUGH_COINS");
		}

		// Deduct coins from user
		user.coins -= total_price;
		await user.save();

		// Add items to user's journey inventory
		const items_to_add = items.map((item) => ({
			item: item._id,
			owned_at: new Date(),
		}));
		journey.inventory.push(...items_to_add);
		await journey.save();

		// Add journey event
		for (const item of items) {
			const event: TJourneyEvent = {
				_id: new Types.ObjectId(),
				action: JourneyEventAction.BUY,
				schema: JourneyEventSchemaType.Item,
				data: {
					item,
				},
				created_at: new Date(),
			};

			await user.add_journey_event(event);
		}

		return res.sendStatus(204);
	}

	@Get(Endpoints.ShopListItems)
	@CatchError()
	@IsAuthenticated()
	protected async list_items(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const journey: IJourneyDocument = res.locals.journey;

		const { search, price_sort } = req.query;
		const cleaned_search = diacriticSensitiveRegex(
			search?.toString()
		).toLocaleLowerCase();

		const query: RootFilterQuery<IItemDocument> = {
			_id: { $nin: journey.inventory.map((i) => i.item._id) },
			category: {
				$nin: [ItemCategory.Achievement],
			},
		};

		let sort_query: Record<string, SortOrder> = {
			created_at: -1, // Default sort by created_at descending
		};
		if (price_sort) {
			const [key, sort] = price_sort.toString().toLowerCase().split("_");
			if (key && sort) {
				sort_query[key] = sort === "asc" ? 1 : -1;
			}

			delete sort_query.created_at; // Remove default sort if price_sort is provided
		}

		query.$or = [{ name: { $regex: cleaned_search, $options: "i" } }];

		const items = await ItemsModel.find(query).sort(sort_query);

		// get user achievements
		const achievements = await user.get_achievements();
		const user_achievements = achievements.map((achievement) =>
			achievement.key.toString()
		);
		// Check item requirements
		const show_locked = Boolean(req.query.locked);

		const items_checked = await Promise.all(
			items.map(async (item) => {
				let locked = false;
				const items_requirements = item.requirements || [];

				// If item has requirements, check if the user has them
				if (items_requirements.length > 0) {
					const user_met_requirements = items_requirements.every((req) =>
						user_achievements.includes(req)
					);

					locked = !user_met_requirements;
				}

				if (!show_locked && locked) {
					return null;
				}

				return { ...item.toObject(), locked };
			})
		);

		const final_items = items_checked.filter((item) => item !== null);

		return res.status(200).json({ items: final_items });
	}
}

export const ShopRepositoryImpl = new ShopRepository();
