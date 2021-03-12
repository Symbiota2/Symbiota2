import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '../../dto/interfaces';
import { TokenService } from '../../../user/services/token.service';

/**
 * Must come after the jwt-auth guard, since it populates req.user
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const request = http.getRequest<AuthenticatedRequest>();
        return TokenService.isSuperAdmin(request.user);
    }
}
