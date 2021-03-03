import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    RefreshToken, User,
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';
import { v4 as uuid4 } from 'uuid';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthRole, UserJwtPayload } from '../../auth/dto/interfaces';

interface RefreshTokenPayload {
    jti: string;
    sub: string;
    aud: string;
}

@Injectable()
export class TokenService extends BaseService<RefreshToken> {
    private readonly logger = new Logger(TokenService.name);

    constructor(
        @Inject(RefreshToken.PROVIDER_ID)
        private readonly refreshTokens: Repository<RefreshToken>,
        private readonly jwt: JwtService) {

        super(refreshTokens);
    }

    async findRefreshToken(tokenStr: string): Promise<RefreshToken> {
        try {
            await this.jwt.verifyAsync(tokenStr);
        }
        catch (e) {
            this.logger.warn(e);
            return null;
        }
        const tokenObj = this.jwt.decode(tokenStr) as RefreshTokenPayload;
        return this.refreshTokens.findOne({
            uid: parseInt(tokenObj.sub),
            clientID: tokenObj.aud,
            token: tokenObj.jti
        });
    }

    async createRefreshToken(uid: number): Promise<string> {
        const tokenData = this.refreshTokens.create({ uid });
        const token = await this.refreshTokens.save(tokenData);
        return this.encodeRefreshToken(token);
    }

    async deleteRefreshToken(uid: number, clientID: string): Promise<boolean> {
        const result = await this.refreshTokens.delete({ uid, clientID });
        return result.affected > 0;
    }

    async updateRefreshToken(uid: number, clientID: string): Promise<string> {
        const existingToken = await this.refreshTokens.findOne({
            uid,
            clientID
        });

        if (!existingToken) {
            return null;
        }

        await this.refreshTokens.delete({
            uid: existingToken.uid,
            clientID: existingToken.clientID
        });

        const newToken = await this.refreshTokens.save(
            Object.assign(existingToken, { token: uuid4() })
        );

        return this.encodeRefreshToken(newToken);
    }

    async createAccessToken(user: User): Promise<string> {
        const roles = await user.roles;
        const minRoles: AuthRole[] = roles.map((role) => {
            return {
                role: role.name,
                tableName: role.tableName,
                tableKey: role.tablePrimaryKey
            }
        });

        const payload: UserJwtPayload = {
            uid: user.uid,
            username: user.username,
            firstName: user.firstName,
            roles: minRoles
        };

        const signOpts: JwtSignOptions = {
            subject: String(user.uid)
        };

        return this.jwt.signAsync(payload, signOpts);
    }

    private encodeRefreshToken(token: RefreshToken): Promise<string> {
        return this.jwt.signAsync({}, {
            subject: String(token.uid),
            jwtid: token.token,
            audience: token.clientID
        });
    }
}
