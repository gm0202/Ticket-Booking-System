import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// This is a type for the constructor of a class
type Constructor<T> = { new (): T };

export function validateDto<T extends object>(dtoClass: Constructor<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Convert plain object to class instance
        const dto = plainToInstance(dtoClass, req.body);
        
        // Validate the class instance
        const errors = await validate(dto, { 
            skipMissingProperties: false,
            whitelist: true,
            forbidNonWhitelisted: true 
        });

        if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => 
                Object.values(error.constraints || {})
            ).join(', ');
            
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
