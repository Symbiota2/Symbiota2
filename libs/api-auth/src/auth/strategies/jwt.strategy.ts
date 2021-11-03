import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@symbiota2/api-config';
import { ApiJwtPayload } from '@symbiota2/data-access';
import { ExtractedJwt } from '../dto/extracted-jwt';
import { JwtKeyService } from '../../jwt-key/jwt-key.service';

/**
 * Passport strategy for authenticating a user based on the contents of a
 * JWT token (see http://www.passportjs.org/packages/passport-jwt/ and
 * https://docs.nestjs.com/security/authentication)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        protected readonly appConfigService: AppConfigService,
        protected readonly jwtKey: JwtKeyService) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: async (req, rawToken, done) => {
                return done(null, await this.jwtKey.getOrCreateKey());
            }
        });
    }

    async validate(payload: ExtractedJwt): Promise<ApiJwtPayload> {
        return {
            uid: parseInt(payload.sub),
            username: payload.username,
            firstName: payload.firstName,
            roles: payload.roles
        };
    }
}
