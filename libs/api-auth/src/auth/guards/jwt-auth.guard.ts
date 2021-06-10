import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppConfigService } from '@symbiota2/api-config';

/**
 * Guard for populating the current user based on the JWT sent with the request
 * ../strategies/jwt.strategy.ts,
 * (see https://docs.nestjs.com/security/authentication and
 * https://docs.nestjs.com/guards)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
