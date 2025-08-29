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
exports.ItemsRepositoryImpl = void 0;
const catch_error_1 = require("../../decorators/catch_error");
const collections_1 = require("../../types/collections");
const items_schema_1 = require("./items.schema");
const http_exception_1 = require("../../core/http_exception");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const base_controller_1 = require("../../core/base_controller");
const routes_decorator_1 = require("../../decorators/routes.decorator");
const generics_1 = require("../../types/generics");
const is_admin_decorator_1 = require("../../decorators/is_admin.decorator");
const upload_decorator_1 = require("../../decorators/upload.decorator");
class ItemsRepository extends base_controller_1.DecoratorController {
    create_figure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { name, price, requirements, category } = req.body;
            const [file_uploaded, item_preview_uploaded] = req.files;
            if (!file_uploaded || !item_preview_uploaded) {
                throw new http_exception_1.HttpException(400, "FILE_NOT_PROVIDED");
            }
            const file = {
                public_id: file_uploaded === null || file_uploaded === void 0 ? void 0 : file_uploaded.filename,
                url: file_uploaded === null || file_uploaded === void 0 ? void 0 : file_uploaded.path,
            };
            const preview = {
                public_id: item_preview_uploaded === null || item_preview_uploaded === void 0 ? void 0 : item_preview_uploaded.filename,
                url: item_preview_uploaded === null || item_preview_uploaded === void 0 ? void 0 : item_preview_uploaded.path,
            };
            const figure = yield items_schema_1.FiguresModel.create({
                name,
                price,
                category: collections_1.ItemCategory.Figure,
                requirements: (_a = requirements.split(",").filter((str) => str !== "")) !== null && _a !== void 0 ? _a : [],
                file,
                preview,
            });
            return res.status(200).json(figure);
        });
    }
    delete_figure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.path;
            const figure = yield items_schema_1.FiguresModel.findById(id);
            if (!figure) {
                throw new http_exception_1.HttpException(404, "ITEM_NOT_FOUND");
            }
            if (figure.file.public_id) {
                yield (0, cloudinary_config_1.cloudinaryDestroy)(figure.file.public_id);
            }
            if (figure.preview.public_id) {
                yield (0, cloudinary_config_1.cloudinaryDestroy)(figure.preview.public_id);
            }
            yield figure.deleteOne();
            return res.status(200).json();
        });
    }
}
__decorate([
    (0, routes_decorator_1.Post)(generics_1.Endpoints.ItemsCreateFigure),
    (0, upload_decorator_1.Upload)({ multiple: true }),
    (0, catch_error_1.CatchError)(),
    (0, is_admin_decorator_1.IsAdmin)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsRepository.prototype, "create_figure", null);
__decorate([
    (0, routes_decorator_1.Delete)("/items/figure/:id"),
    (0, catch_error_1.CatchError)(),
    (0, is_admin_decorator_1.IsAdmin)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ItemsRepository.prototype, "delete_figure", null);
const ItemsRepositoryImpl = new ItemsRepository();
exports.ItemsRepositoryImpl = ItemsRepositoryImpl;
