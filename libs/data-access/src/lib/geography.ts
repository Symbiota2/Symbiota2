import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export interface ApiContinentListItemOutput {
    id: number;
    continentTerm: string;
    acceptedID: number;
}

export interface ApiContinentOutput extends ApiContinentListItemOutput {
    footprintWKT: string;
}

export interface ApiCountryListItemOutput {
    id: number;
    continentID: number;
    acceptedID: number;
    countryTerm: string;
}

export interface ApiCountryOutput extends ApiCountryListItemOutput {
    iso: string;
    iso3: string;
    footprintWKT: string;
}

export interface ApiStateProvinceQueryInput {
    countryID?: number;
    stateTerm?: string;
    limit?: number;
    offset?: number;
}

export interface ApiStateProvinceListItemOutput {
    id: number;
    countryID: number;
    stateTerm: string;
}

export interface ApiStateProvinceOutput extends ApiStateProvinceListItemOutput {
    acceptedID: number;
    footprintWKT: string;
}
