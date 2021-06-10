import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppConfigService } from '@symbiota2/api-config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { RefreshCookieStrategy } from '@symbiota2/api-auth';
import { RequestLoggerInterceptor } from './request-logger/request-logger.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

const GLOBAL_API_PREFIX = 'api/v1';
const SWAGGER_DOCS_PREFIX = 'docs'

/**
 * The main method of the API. Builds the NestJS app, with Swagger UI for
 * documentation. Configures CORS, helmet, cookie-parser, request logging. Also
 * filters incoming requests via ValidationPipe, and outgoing
 * requests via ClassSerializerInterceptor.
 */
export default async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(AppConfigService);

    // Build docs
    const options = new DocumentBuilder()
        .setTitle('Symbiota2')
        .setDescription('Symbiota2 API')
        .setVersion('1.0')
        .addBearerAuth()
        .addCookieAuth(RefreshCookieStrategy.COOKIE_NAME)
        .build();

    // Has to be done before swagger doc is created
    app.setGlobalPrefix(GLOBAL_API_PREFIX);

    // Configure docs
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_DOCS_PREFIX, app, document);

    // Enable helmet in production
    if (!configService.isDevelopment()) {
        app.use(helmet());
    }

    // TODO: Can this be more restrictive?
    app.enableCors({ origin: true, credentials: true });

    // Enable cookie parser
    app.use(cookieParser());

    // Log requests, Serialize output
    // (see https://docs.nestjs.com/techniques/serialization)
    app.useGlobalInterceptors(
        new RequestLoggerInterceptor(),
        new ClassSerializerInterceptor(
            app.get(Reflector),
            {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            }
        )
    );

    // Validate input (see https://docs.nestjs.com/techniques/validation)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    // Can run through a single proxy
    app.set('trust proxy', 1);

    // Start server
    await app.listen(configService.port());
}

bootstrap().catch((e) => {
    console.error(e);
    process.exit(1);
});
