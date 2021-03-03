import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppConfigService } from '@symbiota2/api-config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { RefreshCookieStrategy } from '@symbiota2/api-auth';

const GLOBAL_API_PREFIX = 'api/v1';
const SWAGGER_DOCS_PREFIX = 'docs'

export default async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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

    // Enable CORS, reflect origin
    // TODO: Can this be more restrictive?
    app.use('*', cors({ origin: true, credentials: true }));

    // Enable cookie parser
    app.use(cookieParser());

    // Serialize output
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(
            app.get(Reflector),
            {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            }
        )
    );

    // Validate input
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));

    // Start server
    await app.listen(configService.port());
}

bootstrap().catch((e) => {
    console.error(e);
    process.exit(1);
});
