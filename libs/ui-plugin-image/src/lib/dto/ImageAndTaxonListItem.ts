import { Exclude, Expose, plainToClass } from 'class-transformer';
import { TaxonOnlyListItem } from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem } from '@symbiota2/ui-plugin-image';

@Exclude()
export class ImageAndTaxonListItem {
    // This really should extend the ImageListItem, but it throws an error so copying that here
    @Expose() id: number
    @Expose() taxonID: number | null
    @Expose() url: string
    @Expose() thumbnailUrl: string
    @Expose() originalUrl: string
    @Expose() archiveUrl: string
    @Expose() photographerName: string
    @Expose() photographerUID: number | null
    @Expose() type: string
    @Expose() format: string
    @Expose() caption: string
    @Expose() owner: string
    @Expose() sourceUrl: string
    @Expose() referenceUrl: string
    @Expose() copyright: string
    @Expose() rights: string
    @Expose() accessRights: string
    @Expose() locality: string
    @Expose() occurrenceID: number | null
    @Expose() notes: string
    @Expose() anatomy: string
    @Expose() username: string
    @Expose() sourceIdentifier: string
    @Expose() mediaMD5: string
    @Expose() dynamicProperties: string
    @Expose() sortSequence: number
    @Expose() initialTimestamp: Date
    @Expose() taxon: TaxonOnlyListItem | null

    static fromJSON(imageJSON: Record<string, unknown>): ImageAndTaxonListItem {
        return plainToClass(
            ImageAndTaxonListItem,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
