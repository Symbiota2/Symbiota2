import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppConfigService } from '@symbiota2/api-config';

/**
 * Guard for allowing access based on a username and password. If successful,
 * a refresh cookie is set and access token issued (see
 * ../strategies/local.strategy.ts,
 * https://docs.nestjs.com/security/authentication and
 * https://docs.nestjs.com/guards)
 */
@Injectable()
export class LoginAuthGuard extends AuthGuard('local') implements CanActivate {
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
