import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonomicAuthority {
    constructor(taxaAuthority: TaxonomicAuthority) {
        Object.assign(this, taxaAuthority)
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    name: string

    @ApiProperty()
    @Expose()
    isPrimary: number

    @ApiProperty()
    @Expose()
    description: string | null

    @ApiProperty()
    @Expose()
    editors: string | null

    @ApiProperty()
    @Expose()
    contact: string | null

    @ApiProperty()
    @Expose()
    email: string | null

    @ApiProperty()
    @Expose()
    url: string | null

    @ApiProperty()
    @Expose()
    notes: string | null

    @ApiProperty()
    @Expose()
    isActive: number

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
