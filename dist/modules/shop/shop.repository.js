"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRepositoryImpl = void 0;
const http_exception_1 = require("../../core/http_exception");
const items_1 = require("../items");
const diacriticSensitiveRegex_1 = require("../../utils/diacriticSensitiveRegex");
const catch_error_1 = require("../../decorators/catch_error");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const base_controller_1 = require("../../core/base_controller");
const routes_decorator_1 = require("../../decorators/routes.decorator");
const generics_1 = require("../../types/generics");
const is_authenticated_1 = require("../../decorators/is_authenticated");
class ShopRepository extends base_controller_1.DecoratorController {
    buy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const journey = res.locals.journey;
            const cart = req.body.cart || [];
            if (!cart || !Array.isArray(cart) || cart.length === 0) {
                throw new http_exception_1.HttpException(400, "CART_IS_EMPTY");
            }
            const items = yield items_1.ItemsModel.find({
                _id: { $in: cart },
            });
            // Check if user has none of the items in the cart
            const has_items = items.some((bi) => journey.inventory.some((ji) => ji.item._id.toString() === bi._id.toString()));
            if (has_items) {
                throw new http_exception_1.HttpException(400, "SOME_ITEMS_ALREADY_OWNED");
            }
            // Check item requirements
            const items_requirements = items.map((item) => item.requirements).flat();
            // If item has requirements, check if the user has them
            if (items_requirements.length > 0) {
                const journey_items = journey.inventory.map((i) => i.item);
                const achievements = yield items_1.AchievementsModel.find({
                    _id: { $in: journey_items },
                });
                const user_achievements = achievements.map((achievement) => achievement.category + ":" + achievement.key);
                const user_met_requirements = items_requirements.every((req) => user_achievements.includes(req));
                if (!user_met_requirements) {
                    throw new http_exception_1.HttpException(400, "USER_NOT_MET_ITEMS_REQUIREMENTS");
                }
            }
            // Check if the user has enough coins
            const total_price = items.reduce((acc, item) => acc + item.price, 0);
            const user_coins = user.coins;
            if (user_coins < total_price) {
                throw new http_exception_1.HttpException(400, "USER_DO_NOT_HAVE_ENOUGH_COINS");
            }
            // Deduct coins from user
            user.coins -= total_price;
            yield user.save();
            // Add items to user's journey inventory
            const items_to_add = items.map((item) => ({
                item: item._id,
                owned_at: new Date(),
            }));
            journey.inventory.push(...items_to_add);
            yield journey.save();
            // Add journey event
            for (const item of items) {
                const event = {
                    _id: new mongoose_1.Types.ObjectId(),
                    action: collections_1.JourneyEventAction.BUY,
                    schema: collections_1.JourneyEventSchemaType.Item,
                    data: {
                        item,
                    },
                    created_at: new Date(),
                };
                yield user.add_journey_event(event);
            }
            return res.sendStatus(204);
        });
    }
    list_items(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const journey = res.locals.journey;
            const { search, price_sort } = req.query;
            const cleaned_search = (0, diacriticSensitiveRegex_1.diacriticSensitiveRegex)(search === null || search === void 0 ? void 0 : search.toString()).toLocaleLowerCase();
            const query = {
                _id: { $nin: journey.inventory.map((i) => i.item._id) },
            };
            let sort_query = {
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
            const items = yield items_1.ItemsModel.find(query).sort(sort_query);
            const journey_items = journey.inventory.map((i) => i.item);
            const achievements = yield items_1.AchievementsModel.find({
                _id: { $in: journey_items },
            });
            const user_achievements = achievements.map((achievement) => achievement.category + ":" + achievement.key);
            const locked_items = [];
            // Check item requirements
            const items_checked = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () {
                let locked = false;
                const items_requirements = item.requirements || [];
                // If item has requirements, check if the user has them
                if (items_requirements.length > 0) {
                    const user_met_requirements = items_requirements.every((req) => user_achievements.includes(req));
                    locked = !user_met_requirements;
                }
                return Object.assign(Object.assign({}, item.toObject()), { locked });
            })));
            return res.status(200).json({ items: items_checked });
        });
    }
}
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.ShopBuy),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShopRepository.prototype, "buy", null);
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.ShopListItems),
    (0, catch_error_1.CatchError)(),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShopRepository.prototype, "list_items", null);
exports.ShopRepositoryImpl = new ShopRepository();
