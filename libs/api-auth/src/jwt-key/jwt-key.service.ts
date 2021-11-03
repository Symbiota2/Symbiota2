import { Injectable } from '@nestjs/common';
import { StorageService } from '@symbiota2/api-storage';
import crypto from 'crypto';

@Injectable()
export class JwtKeyService {
    private static readonly JWT_KEY_FILE = '.secrets/jwtSigningKey';
    private static JWT_KEY = '';

    constructor(private readonly storage: StorageService) { }

    /**
     * The JWT signing key that Symbiota2 should use. This is persisted in
     * $APP_DATA_DIR/.jwtSigningKey, since it should remain consistent. If it
     * changes, all users will be forced to log in again.
     */
    async getOrCreateKey() {
        const keyFileExists = await this.storage.hasObject(JwtKeyService.JWT_KEY_FILE);

        if (!keyFileExists) {
            const newKey = crypto.randomBytes(32).toString('hex');
            await this.storage.putData(JwtKeyService.JWT_KEY_FILE, newKey);
            return newKey;
        }

        // Cache it until the server is restarted
        if (JwtKeyService.JWT_KEY === '') {
            const keyBuf = await this.storage.getData(JwtKeyService.JWT_KEY_FILE);
            JwtKeyService.JWT_KEY = keyBuf.toString('utf-8');
        }

        return JwtKeyService.JWT_KEY;
    }
}
