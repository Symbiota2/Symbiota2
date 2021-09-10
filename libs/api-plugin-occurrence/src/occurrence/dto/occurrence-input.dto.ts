import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    IsNumber,
    IsDate
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiOccurrence } from '@symbiota2/data-access';

export class OccurrenceInputDto implements Partial<ApiOccurrence> {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    basisOfRecord: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    catalogNumber: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    otherCatalogNumbers: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    ownerInstitutionCode: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    datasetID: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    scientificName: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    identifiedBy: string = null;

    @ApiProperty({ type: Date, required: false })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    dateIdentified: Date = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    identificationReferences: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    identificationRemarks: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    identificationQualifier: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    typeStatus: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    recordedByNames: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    recordNumber: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    associatedCollectors: string = null;

    @ApiProperty({ type: Date, required: false })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    eventDate: Date = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    habitat: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    substrate: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fieldNotes: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fieldNumber: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    occurrenceRemarks: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    associatedOccurrences: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    associatedTaxa: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    dynamicProperties: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    behavior: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    reproductiveCondition: string = null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    cultivationStatus: number = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    establishmentMeans: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lifeStage: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    sex: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    individualCount: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    samplingProtocol: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    samplingEffort: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    preparations: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    country: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    stateProvince: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    county: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    municipality: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    locality: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    waterBody: string = null;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    latitude: number = null;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    longitude: number = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    geodeticDatum: string = null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    coordinateUncertaintyInMeters: number = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    footprintWKT: string = null;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    coordinatePrecision: number = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    locationRemarks: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    verbatimCoordinates: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    verbatimCoordinateSystem: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    georeferencedBy: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    georeferenceProtocol: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    georeferenceSources: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    georeferenceVerificationStatus: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    georeferenceRemarks: string = null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    minimumElevationInMeters: number = null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    maximumElevationInMeters: number = null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    minimumDepthInMeters: number = null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    maximumDepthInMeters: number = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    disposition: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    storageLocation: string = null;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    language: string = null;
}
