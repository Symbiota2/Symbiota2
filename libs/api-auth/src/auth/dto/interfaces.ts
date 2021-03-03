import { Request } from 'express';

export interface AuthRole {
    role: string;
    tableName: string;
    tableKey: number | null;
}

export interface UserJwtPayload {
    uid: number;
    username: string;
    firstName: string;
    roles: AuthRole[];
}

export interface AuthenticatedRequest extends Request {
    clientID?: string;
    user: UserJwtPayload;
}
