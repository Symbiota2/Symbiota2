import { ApiFindAllQuery } from './common-interfaces';

export interface ApiChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface ApiUserProfileData {
    firstName: string;
    lastName: string;
    title: string;
    institution: string;
    department: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
    url: string;
    biography: string;
    isPublic: number;
}

export interface ApiCreateUserData extends ApiUserProfileData {
    username: string;
    password: string;
}

export interface ApiQueryFindUsers extends ApiFindAllQuery {
    username?: string;
    'username[]'?: string[];
    lastName?: string;
    email?: string;
    'email[]'?: string[];
}

export enum ApiUserRoleName {
    CHECKLIST_ADMIN = "ClAdmin",
    COLLECTION_ADMIN = "CollAdmin",
    COLLECTION_EDITOR = "CollEditor",
    ROLE_COLLECTION_TAXON_EDITOR = "CollTaxon",
    ROLE_KEY_ADMIN = "KeyAdmin",
    ROLE_KEY_EDITOR = "KeyEditor",
    PROJECT_ADMIN = "ProjAdmin",
    RARE_SPECIES_ADMIN = "RareSppAdmin",
    ROLE_RARE_SPP_EDITOR = "RareSppReader",
    RARE_SPECIES_READER = "RareSppReadAll",
    SUPER_ADMIN = "SuperAdmin",
    TAXON_EDITOR = "Taxonomy",
    TAXON_PROFILE_EDITOR = "TaxonProfile"
}

export interface ApiCreateUserRoleData {
    name: ApiUserRoleName;
    tablePrimaryKey?: number;
}

export interface ApiUserRole {
    id: number;
    name: ApiUserRoleName;
    tablePrimaryKey: number;
}

export interface ApiUser {
    uid: number;
    username: string;
    firstName: string;
    lastName: string;
    title: string;
    institution: string;
    department: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
    url: string;
    biography: string;
    isPublic: boolean;
    initialTimestamp: Date;
    lastLogin: Date;
}

export interface ApiJwtPayload {
    uid: number;
    username: string;
    firstName: string;
    roles: ApiUserRole[];
}

export interface ApiLoginRequest {
    username: string;
    password: string;
}

export interface ApiLoginResponse {
    accessToken: string;
}
