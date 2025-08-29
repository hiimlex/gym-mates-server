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
exports.AuthRepositoryImpl = void 0;
const base_controller_1 = require("../../core/base_controller");
const http_exception_1 = require("../../core/http_exception/http_exception");
const journey_1 = require("../journey");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const generics_1 = require("../../types/generics");
const catch_error_1 = require("../../decorators/catch_error");
const is_authenticated_1 = require("../../decorators/is_authenticated");
const routes_decorator_1 = require("../../decorators/routes.decorator");
const upload_decorator_1 = require("../../decorators/upload.decorator");
const users_1 = require("../users");
class AuthRepository extends base_controller_1.DecoratorController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield users_1.UsersModel.findOne({ email });
            if (!user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const is_password_valid = (0, bcrypt_1.compareSync)(password, user.password);
            if (!is_password_valid) {
                throw new http_exception_1.HttpException(400, "INVALID_CREDENTIALS");
            }
            const access_token = (0, jsonwebtoken_1.sign)({ id: user._id.toString() }, generics_1.JwtSecret, {
                expiresIn: generics_1.JwtExpiresIn,
            });
            yield user.updateOne({
                access_token: access_token.toString(),
            });
            return res.status(200).send({
                access_token,
            });
        });
    }
    sign_up(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const { email, password, name } = req.body;
            let avatar = undefined;
            if (file) {
                avatar = {
                    public_id: file.filename,
                    url: file.originalname,
                };
            }
            const hash_password = (0, bcrypt_1.hashSync)(password, generics_1.HashSalt);
            const user = yield users_1.UsersModel.create({
                email,
                password: hash_password,
                name,
                avatar,
            });
            // [Journey] - Create a journey for the user
            const start_event = {
                _id: new mongoose_1.Types.ObjectId(),
                action: collections_1.JourneyEventAction.START,
                schema: collections_1.JourneyEventSchemaType.User,
                created_at: new Date(),
                data: {
                    user: user.toJSON(),
                },
            };
            const user_journey = yield journey_1.JourneyModel.create({
                user: user._id,
                events: [start_event],
                inventory: [],
                healthy: [],
                workouts: [],
            });
            const access_token = (0, jsonwebtoken_1.sign)({ id: user._id.toString() }, generics_1.JwtSecret, {
                expiresIn: generics_1.JwtExpiresIn,
            });
            yield user.updateOne({
                access_token: access_token.toString(),
                journey: user_journey._id,
            });
            return res.status(201).json({ access_token, user });
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            if (!user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            // [StreakSystem] - Check user streak if the user has lost streak based on crews
            yield user.populate({ path: "title journey" });
            yield user.populate({
                path: "followers following",
                select: "-access_token -password -created_at -updated_at",
            });
            return res.status(200).json(user);
        });
    }
    is_authenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const access_token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            console.log("is_authenticated Middleware", access_token);
            if (!access_token) {
                throw new http_exception_1.HttpException(401, "UNAUTHORIZED");
            }
            const decoded_token = (0, jsonwebtoken_1.decode)(access_token);
            if (!decoded_token) {
                throw new http_exception_1.HttpException(401, "UNAUTHORIZED");
            }
            const { id } = decoded_token;
            const user = yield users_1.UsersModel.findById(id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
            }
            const journey = yield journey_1.JourneyModel.findById(user.journey);
            if (!journey) {
                throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
            }
            res.locals.user = user;
            res.locals.journey = journey;
            next();
        });
    }
    is_admin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sudo } = req.body;
            if (sudo !== process.env.SUDO_KEY) {
                throw new http_exception_1.HttpException(403, "FORBIDDEN");
            }
            next();
        });
    }
}
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.AuthLogin),
    (0, catch_error_1.CatchError)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthRepository.prototype, "login", null);
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.AuthSignUp),
    (0, catch_error_1.CatchError)(),
    (0, upload_decorator_1.Upload)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthRepository.prototype, "sign_up", null);
__decorate([
    (0, routes_decorator_1.Get)(generics_1.Endpoints.AuthMe),
    (0, is_authenticated_1.IsAuthenticated)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthRepository.prototype, "me", null);
const AuthRepositoryImpl = new AuthRepository();
exports.AuthRepositoryImpl = AuthRepositoryImpl;
