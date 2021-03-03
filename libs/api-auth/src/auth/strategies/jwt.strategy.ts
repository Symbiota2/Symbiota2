import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@symbiota2/api-config';
import { AuthRole, UserJwtPayload } from '../dto/interfaces';

interface ExtractedJwt {
    username: string;
    firstName: string;
    roles: AuthRole[];
    iat: number;
    exp: number;
    sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected readonly appConfigService: AppConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: async (req, rawToken, done) => {
                return done(null, await appConfigService.jwtKey());
            }
        });
    }

    async validate(payload: ExtractedJwt): Promise<UserJwtPayload> {
        return {
            uid: parseInt(payload.sub),
            username: payload.username,
            firstName: payload.firstName,
            roles: payload.roles
        };
    }
}
