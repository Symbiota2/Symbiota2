import {
    Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppConfigService } from '@symbiota2/api-config';
import { AuthenticatedRequest, AuthRole } from '../dto/interfaces';

/**
 * Decorator for setting roles on a route or controller
 * @param roles The database userRoles that are allowed access the route or
 * controller
 */
export const Roles = (...roles: AuthRole[]) => SetMetadata(RoleGuard.ROLES_META_KEY, roles);

/**
 * This guard must come after JwtAuthGuard, which populates a user's roles
 * // TODO: Split into 'GlobalRoleGuard' and 'ResourceRoleGuard'
 */
@Injectable()
export class RoleGuard implements CanActivate {
    public static readonly ROLES_META_KEY = 'roles';

    constructor(
        private readonly configService: AppConfigService,
        private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.isAuthEnabled()) {
            return true;
        }

        // Grab the values from the Roles decorator, defined above
        const requiredRoles = this.reflector.getAllAndOverride<AuthRole[]>(
            RoleGuard.ROLES_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles) {
            return true;
        }

        const request: AuthenticatedRequest = context.switchToHttp().getRequest();
        const userRoles = request.user.roles;

        // Roles are originally populated by the LocalAuthGuard when a user
        // logs in & is stored in the user's JWT; On each request, JwtAuthGuard
        // validates the JWT & adds the user's roles to the request

        // One of the roles must be present in user's JWT
        for (let roleIdx = 0; roleIdx < requiredRoles.length; roleIdx++) {
            const requiredRole = requiredRoles[roleIdx];
            const matchingRole = userRoles.find((userRole) => {
                return (
                    userRole.role === requiredRole.role &&
                    userRole.tableName === requiredRole.tableName &&
                    userRole.tableKey === requiredRole.tableKey
                );
            });

            if (matchingRole) {
                return true;
            }
        }

        return false;
    }
}
