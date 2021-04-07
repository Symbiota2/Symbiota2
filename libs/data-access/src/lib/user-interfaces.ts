import { ApiFindAllQuery } from './common-interfaces';

export interface ApiInputChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface ApiInputUser {
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

export interface ApiInputCreateUser extends ApiInputUser {
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

export interface ApiInputUserRole {
    name: string;
    tablePrimaryKey?: number;
}

export interface ApiOutputUserRole {
    id: number;
    name: string;
    tablePrimaryKey: number;
}

export interface ApiOutputUser {
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
