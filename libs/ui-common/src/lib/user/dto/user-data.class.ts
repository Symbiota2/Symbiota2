import {
    Exclude,
    Expose,
    plainToClass,
    Transform,
    Type
} from 'class-transformer';
import { Role, RoleTypes, UserRole } from './user-role.class';
import { ApiInputUser, ApiOutputUser } from '@symbiota2/data-access';

export class User {
    @Expose({ name: "sub" })
    public readonly uid: number;

    @Type(() => Number)
    @Transform((iat) => new Date(iat * 1000))
    public readonly exp: Date;

    @Type(() => Number)
    @Transform((iat) => new Date(iat * 1000))
    public readonly iat: Date;

    @Type(() => Object)
    public readonly roles: [];

    public readonly username: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly token: string;

    static fromJSON(obj: Record<string, unknown>): User {
        return plainToClass(User, obj);
    }

    private static checkHasRole(roles: UserRole[], reqRole: Role, reqRoleTgt: number): boolean {
        const roleObjs = roles.filter((roleObj) => roleObj.name === reqRole);
        if (reqRoleTgt) {
            return roleObjs.filter((role) => role.target === reqRoleTgt).length > 0;
        }
        return roleObjs.length > 0;
    }

    canEditCollection(id: number): boolean {
        const isGlobalEditor = this.hasRole(
            Role.ROLE_COLLECTION_EDITOR,
            RoleTypes.ROLE_TYPE_GLOBAL
        );

        const isGlobalAdmin = this.hasRole(
            Role.ROLE_COLLECTION_ADMIN,
            RoleTypes.ROLE_TYPE_GLOBAL
        );

        const isEditor = this.hasRole(
            Role.ROLE_COLLECTION_EDITOR,
            RoleTypes.ROLE_TYPE_COLLECTION,
            id
        );

        const isAdmin = this.hasRole(
            Role.ROLE_COLLECTION_ADMIN,
            RoleTypes.ROLE_TYPE_COLLECTION,
            id
        );

        return this.isSuperAdmin() || isGlobalEditor || isGlobalAdmin || isEditor || isAdmin;
    }

    canEditProject(id: number): boolean {
        const isGlobalAdmin = this.hasRole(
            Role.ROLE_PROJECT_ADMIN,
            RoleTypes.ROLE_TYPE_GLOBAL
        );

        const isAdmin = this.hasRole(
            Role.ROLE_PROJECT_ADMIN,
            RoleTypes.ROLE_TYPE_PROJECT,
            id
        );

        return this.isSuperAdmin() || isGlobalAdmin || isAdmin;
    }

    canEditChecklist(id: number): boolean {
        const isGlobalAdmin = this.hasRole(
            Role.ROLE_CHECKLIST_ADMIN,
            RoleTypes.ROLE_TYPE_GLOBAL
        );

        const isAdmin = this.hasRole(
            Role.ROLE_CHECKLIST_ADMIN,
            RoleTypes.ROLE_TYPE_CHECKLIST,
            id
        );

        return this.isSuperAdmin() || isGlobalAdmin || isAdmin;
    }

    isSuperAdmin(): boolean {
        return this.hasRole(Role.ROLE_SUPER_ADMIN);
    }

    get globalRoles(): UserRole[] {
        return this.getRoles(RoleTypes.ROLE_TYPE_GLOBAL);
    }

    get collectionRoles(): UserRole[] {
        return this.getRoles(RoleTypes.ROLE_TYPE_COLLECTION);
    }

    get checklistRoles(): UserRole[] {
        return this.getRoles(RoleTypes.ROLE_TYPE_CHECKLIST);
    }

    get projectRoles(): UserRole[] {
        return this.getRoles(RoleTypes.ROLE_TYPE_PROJECT);
    }

    private getRoles(type: RoleTypes) {
        if (type === RoleTypes.ROLE_TYPE_GLOBAL) {
            type = null;
        }

        return this.roles.filter(({ tableName }) => tableName === type).map((role) => {
            return new UserRole(role);
        });
    }

    isExpired(): boolean {
        return this.exp <= new Date();
    }

    millisUntilExpires(): number {
        return Math.round(this.exp.getTime() - new Date().getTime());
    }

    hasRole(
        role: Role,
        roleType = RoleTypes.ROLE_TYPE_GLOBAL,
        roleTarget: number = null): boolean {

        switch(roleType) {
            case RoleTypes.ROLE_TYPE_GLOBAL:
                return User.checkHasRole(this.globalRoles, role, roleTarget);
            case RoleTypes.ROLE_TYPE_COLLECTION:
                return User.checkHasRole(this.collectionRoles, role, roleTarget);
            case RoleTypes.ROLE_TYPE_PROJECT:
                return User.checkHasRole(this.projectRoles, role, roleTarget);
            case RoleTypes.ROLE_TYPE_CHECKLIST:
                return User.checkHasRole(this.checklistRoles, role, roleTarget);
            default:
                return false;
        }
    }
}

@Exclude()
export class UserProfileData implements ApiInputUser {
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
