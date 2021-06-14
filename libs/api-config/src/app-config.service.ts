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

/**
 * Service for retrieving configuration values set in environment variables
 */
@Injectable()
export class AppConfigService {
    public static readonly ENV_DEV = 'development';
    public static readonly ENV_TEST = 'test';

    private static readonly JWT_KEY_FILE = '.jwtSigningKey';
    private static readonly PLUGIN_DIR_NAME = 'plugins';

    /**
     * @param path Path to a file
     * @return boolean Whether the file exists
     */
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

    /**
     * @param key The environment variable name
     * @return T The environment variable value
     */
    get<T>(key: string): T {
        return this.configService.get<T>(key);
    }

    /**
     * The port that the app should run on
     */
    port(): number {
        return this.configService.get<number>(ENV_APP_PORT);
    }

    /**
     * The value for NODE_ENV
     */
    environment(): string {
        return this.configService.get<string>(ENV_NODE_ENV);
    }

    /**
     * The path to the directory where Symbiota2 will store data
     */
    async dataDir(): Promise<string> {
        const dataDir = this.configService.get<string>(ENV_APP_DATA_DIR);
        const dirExists = await AppConfigService.fsExists(dataDir);

        if (!dirExists) {
            await fsPromises.mkdir(dataDir, { mode: 0o700, recursive: true });
        }

        return dataDir;
    }

    /**
     * The JWT signing key that Symbiota2 should use. This is persisted in
     * $APP_DATA_DIR/.jwtSigningKey, since it should remain consistent. If it
     * changes, all users will be forced to log in again.
     */
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

    /**
     * Path to directory that contains Symbiota2 API plugins
     * TODO: Not implemented, plugins are currently loaded from an array in app.module.ts in the API core app
     */
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

    /**
     * Whether we're running within a development environment
     */
    isDevelopment(): boolean {
        return [AppConfigService.ENV_DEV, AppConfigService.ENV_TEST]
            .includes(this.environment());
    }

    /**
     * The value of DATABASE_TYPE that specifies the type of database
     * we're using: 'mysql', 'mariadb', 'postgres', 'sqlite'
     * TODO: Currently only mariadb is tested / implemented
     */
    databaseProtocol(): string {
        const proto = this.configService.get<DatabaseProtocol>(ENV_DB_TYPE);

        if (!Object.values(DatabaseProtocol).includes(proto)) {
            throw new Error(`Invalid database protocol '${proto}'`);
        }

        return proto;
    }

    /**
     * Path to the database when DATABASE_TYPE is 'sqlite'
     */
    databasePath(): string {
        const dbType = this.databaseProtocol();

        if (dbType !== DatabaseProtocol.SQLITE) {
            throw new Error('databasePath() should only be used with sqlite. Use databaseUri() instead');
        }

        return this.configService.get<string>(ENV_DB_PATH);
    }

    /**
     * The database uri when DATABASE_TYPE is something other than 'sqlite'
     */
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

    /**
     * The TypeORM database configuration
     */
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

    /**
     * Whether API JWT authentication/authorization is enabled
     */
    isAuthEnabled(): boolean {
        return this.configService.get<string>(ENV_ENABLE_AUTH) === '1';
    }
}
