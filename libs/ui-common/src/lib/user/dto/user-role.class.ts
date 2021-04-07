import { Exclude, Expose } from "class-transformer";
import { ApiInputUserRole } from '@symbiota2/data-access';

export enum Role {
    ROLE_CHECKLIST_ADMIN = "ClAdmin",
    ROLE_COLLECTION_ADMIN = "CollAdmin",
    ROLE_COLLECTION_EDITOR = "CollEditor",
    ROLE_COLLECTION_TAXON_EDITOR = "CollTaxon",
    ROLE_KEY_ADMIN = "KeyAdmin",
    ROLE_KEY_EDITOR = "KeyEditor",
    ROLE_PROJECT_ADMIN = "ProjAdmin",
    ROLE_RARE_SPP_ADMIN = "RareSppAdmin",
    ROLE_RARE_SPP_EDITOR = "RareSppReader",
    ROLE_RARE_SPP_READER = "RareSppReadAll",
    ROLE_SUPER_ADMIN = "SuperAdmin",
    ROLE_TAXON_EDITOR = "Taxonomy",
    ROLE_TAXON_PROFILE_EDITOR = "TaxonProfile"
}

export enum RoleTypes {
    ROLE_TYPE_GLOBAL = "",
    ROLE_TYPE_CHECKLIST = "fmchecklists",
    ROLE_TYPE_PROJECT = "fmprojects",
    ROLE_TYPE_COLLECTION = "omcollections"
}

@Exclude()
export class ApiUserRole implements ApiInputUserRole {
    @Expose()
    name: string;

    @Expose()
    tablePrimaryKey: number;
}

/**
 * Class representing a user role for a specific resource; Which type of
 * resource should be determined via tableName prior to creating an instance
 * of the UserRole
 */
export class UserRole {
    readonly name: Role;
    readonly target: number;

    constructor(role: ApiUserRole) {
        this.name = role.name as Role;
        this.target = role.tablePrimaryKey;
    }
}
