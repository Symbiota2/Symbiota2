import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

import {
    ENV_APP_DATA_DIR,
    ENV_APP_PORT,
    ENV_DB_HOST,
    ENV_DB_NAME,
    ENV_DB_PASSWORD,
    ENV_DB_PATH,
    ENV_DB_PORT,
    ENV_DB_TYPE,
    ENV_DB_USER, ENV_ENABLE_AUTH,
    ENV_NODE_ENV
} from './configuration';

import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const fsPromises = fs.promises;


export enum DatabaseProtocol {
    MYSQL = 'mysql',
    MARIA_DB = 'mariadb',
    POSTGRES = 'postgres',
    SQLITE = 'sqlite',
}

@Injectable()
export class AppConfigService {
    public static readonly ENV_DEV = 'development';
    public static readonly ENV_TEST = 'test';

    private static readonly JWT_KEY_FILE = '.jwtSigningKey';
    private static readonly PLUGIN_DIR_NAME = 'plugins';

    private static async fsExists(path: string): Promise<boolean> {
        try {
            await fsPromises.access(path, fs.constants.F_OK);
            return true;
        }
        catch(_) {
            return false;
        }
    }

    constructor(private readonly configService: ConfigService) { }

    get<T>(key: string): T {
        return this.configService.get<T>(key);
    }

    port(): number {
        return this.configService.get<number>(ENV_APP_PORT);
    }

    environment(): string {
        return this.configService.get<string>(ENV_NODE_ENV);
    }

    async dataDir(): Promise<string> {
        const dataDir = this.configService.get<string>(ENV_APP_DATA_DIR);
        const dirExists = await AppConfigService.fsExists(dataDir);

        if (!dirExists) {
            await fsPromises.mkdir(dataDir, { mode: 0o700, recursive: true });
        }

        return dataDir;
    }

    async jwtKey(): Promise<string> {
        const jwtKeyPath = path.join(
            (await this.dataDir()),
            AppConfigService.JWT_KEY_FILE
        );
        const keyFileExists = await AppConfigService.fsExists(jwtKeyPath);

        if (keyFileExists) {
            return (await fsPromises.readFile(jwtKeyPath))
                .toString()
                .replace(/\s+/, '');
        }

        const newKey = crypto.randomBytes(32).toString('hex');
        await fsPromises.writeFile(
            jwtKeyPath,
            newKey,
            { mode: 0o600 }
        );

        return newKey;
    }

    async pluginDir(): Promise<string> {
        const pluginDir = path.join(
            (await this.dataDir()),
            AppConfigService.PLUGIN_DIR_NAME
        );
        const dirExists = AppConfigService.fsExists(pluginDir);

        if (!dirExists) {
            await fsPromises.mkdir(pluginDir);
        }

        return pluginDir;
    }

    isDevelopment(): boolean {
        return [AppConfigService.ENV_DEV, AppConfigService.ENV_TEST]
            .includes(this.environment());
    }

    databaseProtocol(): string {
        const proto = this.configService.get<DatabaseProtocol>(ENV_DB_TYPE);

        if (!Object.values(DatabaseProtocol).includes(proto)) {
            throw new Error(`Invalid database protocol '${proto}'`);
        }

        return proto;
    }

    databasePath(): string {
        const dbType = this.databaseProtocol();

        if (dbType !== DatabaseProtocol.SQLITE) {
            throw new Error('databasePath() should only be used with sqlite. Use databaseUri() instead');
        }

        return this.configService.get<string>(ENV_DB_PATH);
    }

    databaseUri(): string {
        const dbType = this.databaseProtocol();

        if (dbType === DatabaseProtocol.SQLITE) {
            throw new Error('databaseUri() should not be used with sqlite. Use databasePath() instead');
        }

        const user = this.configService.get<string>(ENV_DB_USER);
        const password = this.configService.get<string>(ENV_DB_PASSWORD);
        const host = this.configService.get<string>(ENV_DB_HOST);
        const port = this.configService.get<number>(ENV_DB_PORT);
        const name = this.configService.get<string>(ENV_DB_NAME);

        let uri = `${dbType}://${encodeURIComponent(user)}:`;
        uri += `${encodeURIComponent(password)}@`;
        uri += `${host}:${port}/${encodeURIComponent(name)}`;

        return uri;
    }

    databaseConfiguration(): ConnectionOptions {
        const dbProto = this.databaseProtocol();
        const migrationsSrcDir = path.join('src', 'database', 'migrations');
        let connectionOpts: ConnectionOptions = {
            type: dbProto as any,
            synchronize: false,
            migrate: false,
            cli: { migrationsDir: migrationsSrcDir },
            logging: this.isDevelopment()
        };

        if (dbProto === DatabaseProtocol.SQLITE) {
            connectionOpts = <ConnectionOptions> {
                ...connectionOpts,
                database: this.databasePath()
            };
        }
        else {
            connectionOpts = <ConnectionOptions> {
                ...connectionOpts,
                url: this.databaseUri()
            };
        }

        return connectionOpts;
    }

    isAuthEnabled(): boolean {
        return this.configService.get<string>(ENV_ENABLE_AUTH) === '1';
    }
}
