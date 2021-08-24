import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    RefreshToken, User
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';
import { v4 as uuid4 } from 'uuid';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
    ApiJwtPayload,
    ApiUserRole,
    ApiUserRoleName
} from '@symbiota2/data-access';

interface RefreshTokenPayload {
    jti: string;
    sub: string;
    aud: string;
}

/**
 * Service for access/refresh token CRUD
 */
@Injectable()
export class TokenService extends BaseService<RefreshToken> {
    private readonly logger = new Logger(TokenService.name);

    constructor(
        @Inject(RefreshToken.PROVIDER_ID)
        private readonly refreshTokens: Repository<RefreshToken>,
        private readonly jwt: JwtService) {

        super(refreshTokens);
    }

    /**
     * Returns a refresh token from the database based on a tokenStr from
     * a client cookie.
     */
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

    /**
     * Creates a new refresh token in the database for the given uid. Returns
     * the token encoded as a JWT for storage in a cookie. This token contains
     * a 'uid', 'clientID', and 'token'. uid represents the user, clientID
     * represents the current machine they're on, and token represents a
     * secret used to validate the uid/clientID pair.
     */
    async createRefreshToken(uid: number): Promise<string> {
        const tokenData = this.refreshTokens.create({ uid });
        const token = await this.refreshTokens.save(tokenData);
        return this.encodeRefreshToken(token);
    }

    /**
     * Deletes a refresh token in the database based on uid and clientID
     */
    async deleteRefreshToken(uid: number, clientID: string): Promise<boolean> {
        const result = await this.refreshTokens.delete({ uid, clientID });
        return result.affected > 0;
    }

    /**
     * Updates the 'token' field of a refresh token in the database for the
     * given uid and clientID.
     */
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

    /**
     * Creates a new access token that a user can use to access protected API
     * resources. The token contains the user's uid, username, firstname, and
     * roles. It's returned as a JWT string.
     */
    async createAccessToken(user: Pick<User, 'uid' | 'username' | 'firstName' | 'roles'>): Promise<string> {
        const roles = await user.roles;
        const minRoles: ApiUserRole[] = roles.map((role) => {
            return {
                id: role.id,
                name: role.name,
                tablePrimaryKey: role.tablePrimaryKey
            }
        });

        const payload: ApiJwtPayload = {
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

    /**
     * Returns whether the user represented by the given JWT has the 'SuperAdmin'
     * role in the database
     */
    static async isSuperAdmin(jwt: ApiJwtPayload): Promise<boolean> {
        return TokenService.hasRole(jwt, ApiUserRoleName.SUPER_ADMIN);
    }

    /**
     * Returns whether the user represented by the given JWT has a 'ChecklistAdmin'
     * role in the database with the given checklistID
     */
    static async isChecklistAdmin(jwt: ApiJwtPayload, checklistID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, ApiUserRoleName.CHECKLIST_ADMIN, checklistID);
    }

    /**
     * Returns whether the user represented by the given JWT has a 'CollAdmin'
     * role in the database with the given collectionID
     */
    static async isCollectionAdmin(jwt: ApiJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, ApiUserRoleName.COLLECTION_ADMIN, collectionID);
    }

    /**
     * Returns whether the user represented by the given JWT has a 'CollEditor'
     * role in the database with the given collectionID
     */
    static async isCollectionEditor(jwt: ApiJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, ApiUserRoleName.COLLECTION_EDITOR, collectionID);
    }

    /**
     * Returns whether the user represented by the given JWT can edit the
     * collection with the given collectionID.
     */
    static async canEditCollection(jwt: ApiJwtPayload, collectionID: number): Promise<boolean> {
        const promises: Promise<boolean>[] = [
            TokenService.isCollectionAdmin(jwt, collectionID),
            TokenService.isCollectionEditor(jwt, collectionID)
        ];

        const [isCollAdmin, isCollEditor] = await Promise.all(promises);
        return isCollAdmin || isCollEditor;
    }

    /**
     * Returns whether the user represented by the given JWT has a 'ProjectAdmin'
     * role in the database with the given projectID
     */
    static async isProjectAdmin(jwt: ApiJwtPayload, projectID: number): Promise<boolean> {
        return TokenService.hasRole(jwt, ApiUserRoleName.PROJECT_ADMIN, projectID);
    }

    /**
     * Returns whether the user represented by the given JWT has a 'RareSppAdmin'
     * role in the database with the given collectionID
     */
    static async isRareSpeciesAdmin(jwt: ApiJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(
            jwt,
            ApiUserRoleName.RARE_SPECIES_ADMIN,
            collectionID
        );
    }

    /**
     * Returns whether the user represented by the given JWT has a 'RareSppReader'
     * role in the database with the given collectionID
     */
    static async isRareSpeciesReader(jwt: ApiJwtPayload, collectionID: number): Promise<boolean> {
        return TokenService.hasRole(
            jwt,
            ApiUserRoleName.RARE_SPECIES_READER,
            collectionID
        );
    }

    /**
     * Returns whether the user represented by the given JWT can view rare
     * species in the given collectionID
     */
    static async canReadRareSpecies(jwt: ApiJwtPayload, collectionID: number): Promise<boolean> {
        const promises: Promise<boolean>[] = [
            TokenService.isRareSpeciesAdmin(jwt, collectionID),
            TokenService.isRareSpeciesReader(jwt, collectionID)
        ];

        const [isRareSppAdmin, isRareSppEditor] = await Promise.all(promises);
        return isRareSppAdmin || isRareSppEditor;
    }

    /**
     * Returns whether the user represented by the given JWT has the 'TaxonEditor'
     * role in the database
     */
    static async isTaxonEditor(jwt: ApiJwtPayload): Promise<boolean> {
        return TokenService.hasRole(jwt, ApiUserRoleName.TAXON_EDITOR);
    }

    /**
     * Returns whether the user represented by the given JWT has the 'TaxonProfile'
     * role in the database
     */
    static async isTaxonProfileEditor(jwt: ApiJwtPayload): Promise<boolean> {
        return this.hasRole(jwt, ApiUserRoleName.TAXON_PROFILE_EDITOR);
    }

    /**
     * Encodes a refresh token from the database as a JWT, which should then
     * be stored in a cookie
     */
    private encodeRefreshToken(token: RefreshToken): Promise<string> {
        return this.jwt.signAsync({}, {
            subject: String(token.uid),
            jwtid: token.token,
            audience: token.clientID
        });
    }

    /**
     * Returns whether the user represented by the given JWT has the given
     * role in the database with the given tablePrimaryKey. If no tablePrimaryKey
     * is set, returns whether the user has the given role in the database with
     * any/no tablePrimaryKey.
     */
    private static async hasRole(payload: ApiJwtPayload, role: ApiUserRoleName, tablePrimaryKey: number = null): Promise<boolean> {
        const matchingRoles = payload.roles.filter((r) => {
            const nameMatches = r.name === role;
            if (tablePrimaryKey === null) {
                return nameMatches;
            }

            return nameMatches && r.tablePrimaryKey === tablePrimaryKey;
        });

        return matchingRoles.length > 0;
    }
}
