import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
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
        const uid = request.user.uid;

        if (uid === parseInt(request.params.id)) {
            return true;
        }

        const user = await this.users.findByID(uid);
        return user.isSuperAdmin();
    }
}
