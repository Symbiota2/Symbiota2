import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


@Exclude()
export class ChecklistInputDto {

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    name: string

    @ApiProperty()
    @Expose()
    title: string

    @ApiProperty()
    @Expose()
    locality: string

    @ApiProperty()
    @Expose()
    publication: string

    @ApiProperty()
    @Expose()
    abstract: string

    @ApiProperty()
    @Expose()
    authors: string

    @ApiProperty()
    @Expose()
    type: string

    @ApiProperty()
    @Expose()
    politicalDivision: string

    @ApiProperty()
    @Expose()
    dynamicSQL: string

    @ApiProperty()
    @Expose()
    parentName: string

    @ApiProperty()
    @Expose()
    parentChecklistID: number | null

    @ApiProperty()
    @Expose()
    notes: string

    @ApiProperty()
    @Expose()
    latCentroid: number | null

    @ApiProperty()
    @Expose()
    longCentroid: number | null

    @ApiProperty()
    @Expose()
    pointRadiusMeters: number | null

    @ApiProperty()
    @Expose()
    footprintWKT: string

    @ApiProperty()
    @Expose()
    percentEffort: number | null;

    @ApiProperty()
    @Expose()
    accecss: string

    @ApiProperty()
    @Expose()
    defaultSettings: string

    @ApiProperty()
    @Expose()
    iconUrl: string

    @ApiProperty()
    @Expose()
    headerUrl: string

    @ApiProperty()
    @Expose()
    creatorUID: number | null;

    @ApiProperty()
    @Expose()
    sortSequence: number;

    @ApiProperty()
    @Expose()
    expirationi: number | null

    @ApiProperty()
    @Expose()
    modifiedTimestamp: Date;

    @ApiProperty()
    @Expose()
    initialTimeStamp: Date;
}