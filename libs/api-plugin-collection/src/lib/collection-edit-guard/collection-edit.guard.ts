import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { JwtAuthGuard, TokenService } from '@symbiota2/api-auth';
import { Reflector } from '@nestjs/core';
import { CollectionRequest } from './collection-request';
import { AppConfigService } from '@symbiota2/api-config';

export const META_KEY_COLLID_PARAM = 'collectionIDParam';
export const META_KEY_COLLID_IN_QUERY = 'collectionIDParamInQuery';

@Injectable()
export class CollectionEditGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        private readonly config: AppConfigService,
        private readonly meta: Reflector) {

        super(config);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!(await super.canActivate(context))) {
            return false;
        }

        if (!this.config.isAuthEnabled()) {
            return true;
        }

        const param = this.meta.get<string>(
            META_KEY_COLLID_PARAM,
            context.getHandler()
        );

        const isInQuery = this.meta.get<boolean>(
            META_KEY_COLLID_IN_QUERY,
            context.getHandler()
        );

        const http = context.switchToHttp();
        const req = http.getRequest<CollectionRequest>();

        let collID: number;

        if (isInQuery) {
            const query = req.query as Record<string, unknown>;
            collID = parseInt(query[param] as string);
        }
        else {
            collID = parseInt(req.params[param]);
        }

        const [isSuperAdmin, isCollectionAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user),
            TokenService.isCollectionAdmin(req.user, collID)
        ]);

        return isSuperAdmin || isCollectionAdmin;
    }
}
