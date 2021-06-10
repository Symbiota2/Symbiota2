import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppConfigService } from '@symbiota2/api-config';

/**
 * Guard for allowing access based on a refresh cookie. If successful,
 * a new access token is issued. (see
 * ../strategies/refresh-cookie.strategy.ts,
 * https://docs.nestjs.com/security/authentication, and
 * https://docs.nestjs.com/guards)
 */
@Injectable()
export class RefreshCookieGuard extends AuthGuard('cookie') {
    constructor(private readonly configService: AppConfigService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.isAuthEnabled()) {
            return true;
        }
        return super.canActivate(context) as Promise<boolean>;
    }
}
