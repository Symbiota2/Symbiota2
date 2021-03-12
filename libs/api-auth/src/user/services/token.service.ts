import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    RefreshToken, User, UserRoleName
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

    static async isSuperAdmin(jwt: UserJwtPayload): Promise<boolean> {
        return TokenService.hasRole(jwt, UserRoleName.ROLE_SUPER_ADMIN);
    }

    static async isChecklistAdmin(jwt: UserJwtPayload, checklistID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, UserRoleName.ROLE_CHECKLIST_ADMIN, checklistID);
    }

    static async isCollectionAdmin(jwt: UserJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, UserRoleName.ROLE_COLLECTION_ADMIN, collectionID);
    }

    static async isCollectionEditor(jwt: UserJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, UserRoleName.ROLE_COLLECTION_EDITOR, collectionID);
    }

    static async canEditCollection(jwt: UserJwtPayload, collectionID: number): Promise<boolean> {
        const promises: Promise<boolean>[] = [
            TokenService.isCollectionAdmin(jwt, collectionID),
            TokenService.isCollectionEditor(jwt, collectionID)
        ];

        const [isCollAdmin, isCollEditor] = await Promise.all(promises);
        return isCollAdmin || isCollEditor;
    }

    static async isProjectAdmin(jwt: UserJwtPayload, projectID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, UserRoleName.ROLE_PROJECT_ADMIN, projectID);
    }

    static async isRareSpeciesAdmin(jwt: UserJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(
            jwt,
            UserRoleName.ROLE_RARE_SPECIES_ADMIN,
            collectionID
        );
    }

    static async isRareSpeciesReader(jwt: UserJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(
            jwt,
            UserRoleName.ROLE_RARE_SPECIES_READER,
            collectionID
        );
    }

    static async canReadRareSpecies(jwt: UserJwtPayload, collectionID: number): Promise<boolean> {
        const promises: Promise<boolean>[] = [
            TokenService.isRareSpeciesAdmin(jwt, collectionID),
            TokenService.isRareSpeciesReader(jwt, collectionID)
        ];

        const [isRareSppAdmin, isRareSppEditor] = await Promise.all(promises);
        return isRareSppAdmin || isRareSppEditor;
    }

    static async isTaxonEditor(jwt: UserJwtPayload): Promise<boolean> {
        return TokenService.hasRole(jwt, UserRoleName.ROLE_TAXON_EDITOR);
    }

    static async isTaxonProfileEditor(jwt: UserJwtPayload): Promise<boolean> {
        return this.hasRole(jwt, UserRoleName.ROLE_TAXON_PROFILE);
    }

    private encodeRefreshToken(token: RefreshToken): Promise<string> {
        return this.jwt.signAsync({}, {
            subject: String(token.uid),
            jwtid: token.token,
            audience: token.clientID
        });
    }

    private static async hasRole(payload: UserJwtPayload, role: UserRoleName, tablePrimaryKey: number = null): Promise<boolean> {
        const matchingRoles = payload.roles.filter((r) => {
            const nameMatches = r.role === role.toString();
            if (tablePrimaryKey === null) {
                return nameMatches;
            }

            return nameMatches && r.tableKey === tablePrimaryKey;
        });

        return matchingRoles.length > 0;
    }
}
