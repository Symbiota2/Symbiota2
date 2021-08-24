import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../../auth/dto/authenticated-request';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Injectable()
export class NotificationGuard extends JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(NotificationGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const hasJwt = await super.canActivate(context);
        if (!hasJwt) {
            return false;
        }

        try {
            const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
            const uidParam = req.params['uid'];
            const jwtUID = req.user.uid;

            if (!uidParam) {
                return true;
            }

            return jwtUID === parseInt(uidParam);
        }
        catch (e) {
            this.logger.warn(`Authorization threw an error: ${JSON.stringify(e)}`)
            return false;
        }
    }
}
