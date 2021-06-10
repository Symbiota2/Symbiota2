import { Strategy } from 'passport-cookie';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@symbiota2/api-database';
import { TokenService } from '../../user/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { AuthenticatedRequest } from '../dto/authenticated-request';

/**
 * Passport strategy for authenticating a user based on the contents
 * of a cookie called refreshToken. This token should contain a JWT signed
 * by our server that holds a uid and clientID. This is basically an
 * implementation of OAuth2.
 * (see http://www.passportjs.org/packages/passport-cookie/ and
 * https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
 */
@Injectable()
export class RefreshCookieStrategy extends PassportStrategy(Strategy) {
    public static readonly COOKIE_NAME = 'refreshToken';

    constructor(
        protected readonly jwt: JwtService,
        protected readonly tokens: TokenService,
        protected readonly users: UserService) {

        super({
            cookieName: RefreshCookieStrategy.COOKIE_NAME,
            passReqToCallback: true
        });
    }

    async validate(req: AuthenticatedRequest, cookieValue: string): Promise<User> {
        const token = await this.tokens.findRefreshToken(cookieValue);

        if (!token || token.isExpired()) {
            if (token) {
                // It's expired, delete it
                await this.tokens.deleteRefreshToken(token.uid, token.clientID);
            }
            throw new UnauthorizedException();
        }

        req.clientID = token.clientID;
        return this.users.findByID(token.uid);
    }
}
