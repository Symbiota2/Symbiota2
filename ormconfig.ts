import { ConnectionOptions } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppConfigModule, AppConfigService } from './libs/api-config/src';
import { glob } from 'glob';
// @ts-ignore
import path from 'path';

const API_DATABASE_PLUGIN_DIR = path.join('libs', 'api-database')
const ENTITIES_DIR = path.join(API_DATABASE_PLUGIN_DIR, 'src', 'entities');
const MIGRATIONS_DIR = path.join(API_DATABASE_PLUGIN_DIR, 'src', 'migrations');

async function bootstrap(): Promise<ConnectionOptions> {
    const app = await NestFactory.createApplicationContext(AppConfigModule);
    const appConfig = app.get(AppConfigService);

    const entitiesFiles = glob.sync(path.join(ENTITIES_DIR, "**", "*.entity.ts"));
    const migrationsFiles = glob.sync(path.join(MIGRATIONS_DIR, "**", "*.ts"));

    return {
        ...appConfig.databaseConfiguration(),
        entities: entitiesFiles,
        migrations: migrationsFiles,
        cli: {
            entitiesDir: ENTITIES_DIR,
            migrationsDir: MIGRATIONS_DIR
        },
    };
}

module.exports = bootstrap();
