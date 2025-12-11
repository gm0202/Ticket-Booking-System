"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
function validateDto(dtoClass) {
    return async (req, res, next) => {
        // Convert plain object to class instance
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        // Validate the class instance
        const errors = await (0, class_validator_1.validate)(dto, {
            skipMissingProperties: false,
            whitelist: true,
            forbidNonWhitelisted: true
        });
        if (errors.length > 0) {
            const message = errors.map((error) => Object.values(error.constraints || {})).join(', ');
            return res.status(400).json({
                success: false,
                message: `Validation failed: ${message}`
            });
        }
        // Attach the validated DTO to the request object
        req.body = dto;
        next();
    };
}
