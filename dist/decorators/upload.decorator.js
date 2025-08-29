"use strict";
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
exports.Upload = Upload;
const upload_middleware_1 = require("../middlewares/upload.middleware");
const destroyCloudinaryFileOnError_1 = require("../utils/destroyCloudinaryFileOnError");
const handle_error_1 = require("../utils/handle_error");
function runMulter(req, res, field, multiple) {
    return new Promise((resolve, reject) => {
        const middleware = multiple
            ? upload_middleware_1.upload.array(field) // multiple files
            : upload_middleware_1.upload.single(field); // single file
        middleware(req, res, (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
function Upload({ multiple, field } = {
    multiple: false,
    field: upload_middleware_1.upload_key,
}) {
    return (_, __, descriptor) => {
        const originalValue = descriptor.value;
        descriptor.value = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const defaultField = field || upload_middleware_1.upload_key;
                    // Run multer depending on single vs multiple
                    yield runMulter(req, res, defaultField, !!multiple);
                    // Call original controller method
                    return yield originalValue.apply(this, [req, res, next]);
                }
                catch (error) {
                    // Cleanup uploaded file(s) if error occurs
                    yield (0, destroyCloudinaryFileOnError_1.destroyCloudinaryFileOnError)(req);
                    return (0, handle_error_1.handle_error)(res, error);
                }
            });
        };
    };
}
