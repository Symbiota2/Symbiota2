import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { TokenService } from '@symbiota2/api-auth';
import { Reflector } from '@nestjs/core';
import { CollectionRequest } from './collection-request';
import { AppConfigService } from '@symbiota2/api-config';

export const META_KEY_COLLID_ROUTE_PARAM = 'collectionIDParam';

@Injectable()
export class CollectionEditGuard implements CanActivate {
    constructor(
        private readonly config: AppConfigService,
        private readonly meta: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.config.isAuthEnabled()) {
            return true;
        }

        const param = this.meta.get<string>(
            META_KEY_COLLID_ROUTE_PARAM,
            context.getHandler()
        );

        const http = context.switchToHttp();
        const req = http.getRequest<CollectionRequest>();

        const collID = parseInt(req.params[param]);

        const [isSuperAdmin, isCollectionAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user),
            TokenService.isCollectionAdmin(req.user, collID)
        ]);

        return isSuperAdmin || isCollectionAdmin;
    }
}
