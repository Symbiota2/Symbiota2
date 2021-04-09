import { Request } from 'express';
import { ApiJwtPayload } from '@symbiota2/data-access';

export interface AuthenticatedRequest extends Request {
    clientID?: string;
    user: ApiJwtPayload;
}
