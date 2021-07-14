import {
    Exclude,
    Expose,
    plainToClass,
    Transform,
    Type
} from 'class-transformer';
import {
    ApiUserProfileData,
    ApiUserRoleName
} from '@symbiota2/data-access';
import { UserRole } from './user-role.class';

export class User {
    @Expose({ name: "sub" })
    public readonly uid: number;

    @Type(() => Number)
    @Transform((iat) => new Date(iat * 1000))
    public readonly exp: Date;

    @Type(() => Number)
    @Transform((iat) => new Date(iat * 1000))
    public readonly iat: Date;

    @Type(() => UserRole)
    public readonly roles: UserRole[];

    public readonly username: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly token: string;

    static fromJSON(obj: Record<string, unknown>): User {
        return plainToClass(User, obj);
    }

    private static checkHasRole(roles: UserRole[], reqRole: ApiUserRoleName, tablePk: number = null): boolean {
        const roleObjs = roles.filter((roleObj) => roleObj.name === reqRole);
        if (tablePk !== null) {
            return roleObjs.filter((role) => role.tablePrimaryKey === tablePk).length > 0;
        }
        return roleObjs.length > 0;
    }

    canEditCollection(id: number): boolean {
        const isGlobalEditor = this.hasRole(ApiUserRoleName.COLLECTION_EDITOR);
        const isGlobalAdmin = this.hasRole(ApiUserRoleName.COLLECTION_ADMIN);
        const isAdmin = this.hasRole(ApiUserRoleName.COLLECTION_ADMIN, id);

        return this.isSuperAdmin() || isGlobalEditor || isGlobalAdmin || isAdmin;
    }

    canEditProject(id: number): boolean {
        const isGlobalAdmin = this.hasRole(ApiUserRoleName.PROJECT_ADMIN);
        const isAdmin = this.hasRole(ApiUserRoleName.PROJECT_ADMIN, id);

        return this.isSuperAdmin() || isGlobalAdmin || isAdmin;
    }

    canEditChecklist(id: number): boolean {
        const isGlobalAdmin = this.hasRole(ApiUserRoleName.CHECKLIST_ADMIN);
        const isAdmin = this.hasRole(ApiUserRoleName.CHECKLIST_ADMIN, id);

        return this.isSuperAdmin() || isGlobalAdmin || isAdmin;
    }

    isSuperAdmin(): boolean {
        return this.hasRole(ApiUserRoleName.SUPER_ADMIN);
    }

    get globalRoles(): UserRole[] {
        return this.roles.filter((role) => role.tablePrimaryKey === null);
    }

    get collectionRoles(): UserRole[] {
        return this.roles.filter((role) => {
            return [
                ApiUserRoleName.COLLECTION_ADMIN,
                ApiUserRoleName.COLLECTION_EDITOR
            ].includes(role.name);
        });
    }

    get checklistRoles(): UserRole[] {
        return this.roles.filter((role) => {
            return role.name === ApiUserRoleName.COLLECTION_EDITOR;
        });
    }

    get projectRoles(): UserRole[] {
        return this.roles.filter((role) => {
            return role.name === ApiUserRoleName.PROJECT_ADMIN;
        });
    }

    isExpired(): boolean {
        return this.exp <= new Date();
    }

    millisUntilExpires(): number {
        return Math.round(this.exp.getTime() - new Date().getTime());
    }

    hasRole(role: ApiUserRoleName, roleTarget: number = null): boolean {
        if (roleTarget === null) {
            return User.checkHasRole(this.globalRoles, role);
        }

        // TODO: Implement more roles
        switch(role) {
            case ApiUserRoleName.CHECKLIST_ADMIN:
                return User.checkHasRole(this.checklistRoles, role, roleTarget);
            case ApiUserRoleName.COLLECTION_ADMIN:
            case ApiUserRoleName.COLLECTION_EDITOR:
                return User.checkHasRole(this.collectionRoles, role, roleTarget);
            case ApiUserRoleName.PROJECT_ADMIN:
                return User.checkHasRole(this.projectRoles, role, roleTarget);
            default:
                return false;
        }
    }
}

@Exclude()
export class UserProfileData implements ApiUserProfileData {
    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    title: string;

    @Expose()
    institution: string;

    @Expose()
    department: string;

    @Expose()
    address: string;

    @Expose()
    phone: string;

    @Expose()
    city: string;

    @Expose()
    state: string;

    @Expose()
    zip: string;

    @Expose()
    country: string;

    @Expose()
    url: string;

    @Expose()
    biography: string;

    @Expose()
    @Transform((isPublic) => {
        if (typeof isPublic === 'boolean') {
            return isPublic ? 1 : 0;
        }
        return isPublic;
    })
    isPublic: number;
}
