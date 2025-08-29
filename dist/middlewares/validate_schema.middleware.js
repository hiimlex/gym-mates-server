"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_schema = validate_schema;
const handle_error_1 = require("../utils/handle_error");
function validate_schema(validator) {
    return (req, res, next) => {
        const { error } = validator.validate(req.body);
        if (error) {
            return (0, handle_error_1.handle_error)(res, error);
        }
        next();
    };
}
