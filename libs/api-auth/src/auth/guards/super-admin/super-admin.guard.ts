import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '../../dto/authenticated-request';
import { TokenService } from '../../../user/services/token/token.service';
import { AppConfigService } from '@symbiota2/api-config';
import { JwtAuthGuard } from '../jwt-auth.guard';

/**
 * Guard for checking whether the current user has the 'SuperAdmin' role in
 * the database. It must come after the jwt-auth guard, since the user must be
 * populated in the request. (see https://docs.nestjs.com/security/authentication
 * and https://docs.nestjs.com/guards)
 */
@Injectable()
export class SuperAdminGuard extends JwtAuthGuard implements CanActivate {
    constructor(protected readonly configService: AppConfigService) {
        super(configService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isJwtAuthed = super.canActivate(context);

        if (!this.configService.isAuthEnabled()) {
            return true;
        }

        if (!isJwtAuthed) {
            return false;
        }

        const http = context.switchToHttp();
        const request = http.getRequest<AuthenticatedRequest>();
        return TokenService.isSuperAdmin(request.user);
    }
}
