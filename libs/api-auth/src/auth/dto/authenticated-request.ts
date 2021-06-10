import { Request } from 'express';
import { ApiJwtPayload } from '@symbiota2/data-access';

/**
 * Represents an Express Request that also contains a cookie clientID and
 * user JWT payload, populated by ../strategies/refresh-cookie.strategy.ts and
 * ../strategies/jwt.strategy.ts, respectively
 */
export interface AuthenticatedRequest extends Request {
    clientID?: string;
    user: ApiJwtPayload;
}
