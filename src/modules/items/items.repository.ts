import { destroyCloudinaryFileOnError } from "@utils/destroyCloudinaryFileOnError";
import { CatchError } from "../../decorators/catch_error";
import { Request, Response } from "express";
import {
	IFigureDocument,
	ItemCategory,
	TFile,
	TUploadedFile,
} from "types/collections";
import { FiguresModel, SkinsModel } from "./items.schema";
import { HttpException } from "@core/http_exception";
import { cloudinaryDestroy } from "@config/cloudinary.config";
import { DecoratorController } from "@core/base_controller";
import { Delete, Post } from "../../decorators/routes.decorator";
import { Endpoints } from "types/generics";
import { IsAdmin } from "../../decorators/is_admin.decorator";
import { Upload } from "../../decorators/upload.decorator";

class ItemsRepository extends DecoratorController {
	@Post(Endpoints.ItemsCreateFigure)
	@Upload({ multiple: true })
	@CatchError()
	@IsAdmin()
	protected async create_figure(req: Request, res: Response) {
		const { name, price, requirements, category } = req.body;
		const [file_uploaded, item_preview_uploaded] = req.files as TUploadedFile[];
		if (!file_uploaded || !item_preview_uploaded) {
			throw new HttpException(400, "FILE_NOT_PROVIDED");
		}

		const file: TFile = {
			public_id: file_uploaded?.filename,
			url: file_uploaded?.path,
		};
		const preview: TFile = {
			public_id: item_preview_uploaded?.filename,
			url: item_preview_uploaded?.path,
		};

		const figure = await FiguresModel.create({
			name,
			price,
			category: ItemCategory.Figure,
			requirements:
				requirements.split(",").filter((str: string) => str !== "") ?? [],
			file,
			preview,
		});

		return res.status(200).json(figure);
	}

	@Delete("/items/figure/:id")
	@CatchError()
	@IsAdmin()
	protected async delete_figure(req: Request, res: Response) {
		const id = req.path;

		const figure = await FiguresModel.findById(id);

		if (!figure) {
			throw new HttpException(404, "ITEM_NOT_FOUND");
		}

		if (figure.file.public_id) {
			await cloudinaryDestroy(figure.file.public_id);
		}

		if (figure.preview.public_id) {
			await cloudinaryDestroy(figure.preview.public_id);
		}

		await figure.deleteOne();

		return res.status(200).json();
	}
}

const ItemsRepositoryImpl = new ItemsRepository();

export { ItemsRepositoryImpl };
