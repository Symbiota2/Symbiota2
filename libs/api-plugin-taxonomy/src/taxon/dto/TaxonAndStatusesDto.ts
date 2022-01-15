import { Exclude, Expose, Type } from 'class-transformer';
import { Taxon } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { TaxonomicStatusDto } from '../../taxonomicStatus/dto/TaxonomicStatusDto';
import { TaxonDto } from './TaxonDto';

@Exclude()
export class TaxonAndStatusesDto extends TaxonDto {
    constructor(taxa: Taxon) {
        super(taxa)
        // Object.assign(this, taxa)
    }

    @ApiProperty()
    @Expose()
    taxonStatuses: TaxonomicStatusDto[]

}
