import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '../../dto/authenticated-request';
import { TokenService } from '../../../user/services/token.service';
import { AppConfigService } from '@symbiota2/api-config';

/**
 * Guard for checking whether the current user has the 'SuperAdmin' role in
 * the database. It must come after the jwt-auth guard, since the user must be
 * populated in the request. (see https://docs.nestjs.com/security/authentication
 * and https://docs.nestjs.com/guards)
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private readonly configService: AppConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.isAuthEnabled()) {
            return true;
        }

        const http = context.switchToHttp();
        const request = http.getRequest<AuthenticatedRequest>();
        return TokenService.isSuperAdmin(request.user);
    }
}
