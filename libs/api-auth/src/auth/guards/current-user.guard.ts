import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { UserRole } from '@symbiota2/api-database';
import { AppConfigService } from '@symbiota2/api-config';
import { AuthenticatedRequest } from '../dto/interfaces';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class CurrentUserGuard implements CanActivate {
    constructor(
        private readonly users: UserService,
        private readonly configService: AppConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.isAuthEnabled()) {
            return true;
        }

        const request: AuthenticatedRequest = context.switchToHttp().getRequest();

        if (request.user.uid === parseInt(request.params.id)) {
            return true;
        }

        // Requires the JwtAuthGuard
        return this.users.hasRole(
            request.user.uid,
            { role: UserRole.ROLE_SUPER_ADMIN, tableName: null, tableKey: null }
        );
    }
}
