declare module 'swagger-ui-express' {
    import { RequestHandler } from 'express';
    
    interface SwaggerUiOptions {
        explorer?: boolean;
        swaggerOptions?: Record<string, any>;
        customCss?: string;
        customCssUrl?: string;
        customSiteTitle?: string;
        customfavIcon?: string;
        swaggerUrl?: string;
        customJs?: string;
        validatorUrl?: string | null;
    }

    function serve(handlers?: RequestHandler[]): RequestHandler;
    function setup(swaggerDoc: any, options?: SwaggerUiOptions): RequestHandler;

    export { serve, setup };
}
