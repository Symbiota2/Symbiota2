import { ApiUserRole } from '@symbiota2/data-access';

/**
 * Object representation of the JWT set by the server / sent by the client
 */
export interface ExtractedJwt {
    username: string;
    firstName: string;
    roles: ApiUserRole[];
    iat: number;
    exp: number;
    sub: string;
}
