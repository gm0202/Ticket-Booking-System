"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const database_1 = require("./config/database");
const error_middleware_1 = require("./middlewares/error.middleware");
class App {
    constructor(controllers, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    async initializeDatabase() {
        try {
            await database_1.AppDataSource.initialize();
            console.log('Database connected successfully');
        }
        catch (error) {
            console.error('Database connection error:', error);
            process.exit(1);
        }
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, body_parser_1.json)());
        this.app.use((0, body_parser_1.urlencoded)({ extended: true }));
        // Add validation middleware
        this.app.use((req, res, next) => {
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                // This is a simplified validation middleware
                // In a real app, you'd want to map routes to DTOs
                next();
            }
            else {
                next();
            }
        });
    }
    initializeControllers(controllers) {
        try {
            // Setup Swagger
            const options = {
                definition: {
                    openapi: '3.0.0',
                    info: {
                        title: 'Ticket Booking API',
                        version: '1.0.0',
                        description: 'The Ticket Booking System API documentation',
                    },
                    servers: [
                        {
                            url: 'http://localhost:3000/api',
                            description: 'Development server',
                        },
                    ],
                    components: {
                        securitySchemes: {
                            bearerAuth: {
                                type: 'http',
                                scheme: 'bearer',
                                bearerFormat: 'JWT',
                            }
                        }
                    },
                    security: [{
                            bearerAuth: []
                        }]
                },
                apis: ['./src/**/*.ts'],
            };
            const specs = (0, swagger_jsdoc_1.default)(options);
            this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
                explorer: true,
                customSiteTitle: 'Ticket Booking API Docs',
            }));
            // Setup API routes
            controllers.forEach((controller) => {
                this.app.use('/api', controller.router);
            });
        }
        catch (error) {
            console.error('Failed to initialize API documentation:', error);
        }
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.errorHandler);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
exports.App = App;
exports.default = App;
