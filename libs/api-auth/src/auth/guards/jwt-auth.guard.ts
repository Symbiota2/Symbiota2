import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppConfigService } from '@symbiota2/api-config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
