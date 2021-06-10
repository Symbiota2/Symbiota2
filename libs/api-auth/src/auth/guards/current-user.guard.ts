import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AppConfigService } from '@symbiota2/api-config';
import { AuthenticatedRequest } from '../dto/authenticated-request';
import { TokenService } from '../../user/services/token.service';

/**
 * Guard that makes sure the current user's uid matches the 'id' request
 * parameter (/some/route/:id). Useful for something like a user accessing their
 * own profile. It must come after the jwt-auth guard, since the user must
 * be populated in the request. (see
 * https://docs.nestjs.com/security/authentication and
 * https://docs.nestjs.com/guards)
 */
@Injectable()
export class CurrentUserGuard implements CanActivate {
    constructor(
        private readonly configService: AppConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.isAuthEnabled()) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (request.user.uid === parseInt(request.params.id)) {
            return true;
        }

        return TokenService.isSuperAdmin(request.user);
    }
}
