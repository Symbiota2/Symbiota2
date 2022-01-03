import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class ImageInputDto {

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    taxonID: number | null;

    @ApiProperty()
    @Expose()
    url: string;

    @ApiProperty()
    @Expose()
    thumbnailUrl: string;

    @ApiProperty()
    @Expose()
    originalUrl: string;

    @ApiProperty()
    @Expose()
    archiveUrl: string;

    @ApiProperty()
    @Expose()
    photographerName: string;

    @ApiProperty()
    @Expose()
    photographerUID: number | null;

    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty()
    @Expose()
    format: string;

    @ApiProperty()
    @Expose()
    caption: string;

    @ApiProperty()
    @Expose()
    owner: string;

    @ApiProperty()
    @Expose()
    sourceUrl: string;

    @ApiProperty()
    @Expose()
    referenceUrl: string;

    @ApiProperty()
    @Expose()
    copyright: string;

    @ApiProperty()
    @Expose()
    rights: string;

    @ApiProperty()
    @Expose()
    accessRights: string;

    @ApiProperty()
    @Expose()
    locality: string;

    @ApiProperty()
    @Expose()
    occurrenceID: number | null;

    @ApiProperty()
    @Expose()
    notes: string;

    @ApiProperty()
    @Expose()
    anatomy: string;

    @ApiProperty()
    @Expose()
    username: string;

    @ApiProperty()
    @Expose()
    sourceIdentifier: string;

    @ApiProperty()
    @Expose()
    mediaMD5: string;

    @ApiProperty()
    @Expose()
    dynamicProperties: string;

    @ApiProperty()
    @Expose()
    sortSequence: number;

    @ApiProperty()
    @Expose()
    initialTimestamp: Date;

}
