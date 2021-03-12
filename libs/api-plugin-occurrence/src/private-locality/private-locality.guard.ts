import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedRequest, UserService } from '@symbiota2/api-auth';

/**
 * Must come after the jwt auth guard, since it populates req.user
 */
@Injectable()
export class PrivateLocalityGuard implements CanActivate {
    constructor(private readonly users: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const req = http.getRequest<AuthenticatedRequest & { params: Record<string, unknown> }>();
        const uid = req.user.uid;

        const user = await this.users.findByID(uid);
        return user.canEditCollection(parseInt(req.params['id']));
    }
}
