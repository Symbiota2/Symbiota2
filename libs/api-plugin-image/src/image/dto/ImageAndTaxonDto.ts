import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Image } from '@symbiota2/api-database';
import { TaxonDto } from '../../../../api-plugin-taxonomy/src/taxon/dto/TaxonDto';
import { ImageDto } from './ImageDto';

@Exclude()
export class ImageAndTaxonDto extends ImageDto {

    constructor(image: Image, taxonDto : TaxonDto ) {
        super(image)
        //Object.assign(this, image)
        this.taxon = taxonDto
    }

    @ApiProperty()
    @Expose()
    taxon: TaxonDto

}
