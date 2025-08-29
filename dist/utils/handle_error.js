"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_error = handle_error;
const logger_config_1 = require("../config/logger.config");
const http_exception_1 = require("../core/http_exception");
function handle_error(res, error) {
    const message = error.message || "";
    if (error instanceof http_exception_1.HttpException) {
        logger_config_1.logger.error(`ERROR: ${error.status}] ${error.message}`);
        return res.status(error.status).json({ message, content: error.content });
    }
    logger_config_1.logger.error(`ERROR: ${message}`);
    return res.status(400).json({ message });
}
