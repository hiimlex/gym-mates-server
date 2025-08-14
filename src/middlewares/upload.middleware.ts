import { storage } from "@config/cloudinary.config";
import multer from "multer";

export const upload_key = "image";

export const upload = multer({ storage });
