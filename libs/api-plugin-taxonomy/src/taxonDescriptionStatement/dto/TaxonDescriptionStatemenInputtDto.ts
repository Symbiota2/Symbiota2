import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { TaxonDescriptionStatement } from '@symbiota2/api-database';

@Exclude()
export class TaxonDescriptionStatementInputDto {

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    descriptionBlockID: number

    @ApiProperty()
    @Expose()
    heading: string

    @ApiProperty()
    @Expose()
    statement: string

    @ApiProperty()
    @Expose()
    displayHeader: number

    @ApiProperty()
    @Expose()
    notes: string | null;

    @ApiProperty()
    @Expose()
    sortSequence: number

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
