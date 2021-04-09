import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AppConfigService } from '@symbiota2/api-config';
import { AuthenticatedRequest } from '../dto/authenticated-request';
import { TokenService } from '../../user/services/token.service';

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
