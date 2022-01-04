import { Exclude, Expose, plainToClass } from 'class-transformer';
import { TaxonOnlyListItem } from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem } from '@symbiota2/ui-plugin-image';

@Exclude()
export class ImageAndTaxonListItem extends ImageListItem {
    @Expose() taxon: TaxonOnlyListItem | null

    static fromJSON(imageJSON: Record<string, unknown>): ImageAndTaxonListItem {
        return plainToClass(
            ImageAndTaxonListItem,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
