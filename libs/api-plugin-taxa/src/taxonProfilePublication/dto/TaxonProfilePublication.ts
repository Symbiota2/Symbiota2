import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
export class TaxonProfilePublication {
    constructor(taxonProfilePublication: TaxonProfilePublication) {
        Object.assign(this, taxonProfilePublication)
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    title: string

    @ApiProperty()
    @Expose()
    authors: string | null

    @ApiProperty()
    @Expose()
    description: string | null

    @ApiProperty()
    @Expose()
    abstract: string | null

    @ApiProperty()
    @Expose()
    ownerUID: number | null

    @ApiProperty()
    @Expose()
    externalUrl: string | null

    @ApiProperty()
    @Expose()
    rights: string | null

    @ApiProperty()
    @Expose()
    usageTerm: string | null

    @ApiProperty()
    @Expose()
    accessRights: string | null

    @ApiProperty()
    @Expose()
    isPublic: number | null

    @ApiProperty()
    @Expose()
    inclusive: number | null

    @ApiProperty()
    @Expose()
    dynamicProperties: string | null

    @ApiProperty()
    @Expose()
    initialTimestamp: Date | null

}
