import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from '../../dto/interfaces';
import { UserService } from '../../../user/services/user.service';

/**
 * Must come after the jwt-auth guard, since it populates req.user
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private readonly users: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const request = http.getRequest<AuthenticatedRequest>();
        const uid = request.user.uid;
        const user = await this.users.findByID(uid);
        return user.isSuperAdmin();
    }
}
