import { ApiUserRole } from '@symbiota2/data-access';

export interface ExtractedJwt {
    username: string;
    firstName: string;
    roles: ApiUserRole[];
    iat: number;
    exp: number;
    sub: string;
}
