import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '../../dto/interfaces';
import { TokenService } from '../../../user/services/token.service';
import { AppConfigService } from '@symbiota2/api-config';

/**
 * Must come after the jwt-auth guard, since it populates req.user
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
