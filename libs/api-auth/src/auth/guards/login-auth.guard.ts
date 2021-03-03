import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppConfigService } from '@symbiota2/api-config';

@Injectable()
export class LoginAuthGuard extends AuthGuard('local') implements CanActivate {
    constructor(private readonly configService: AppConfigService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.configService.isAuthEnabled()) {
            return true;
        }

        return super.canActivate(context) as Promise<boolean>;
    }
}
