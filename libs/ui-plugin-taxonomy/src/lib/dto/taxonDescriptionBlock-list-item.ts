import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonDescriptionStatementListItem, TaxonListItem } from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem } from '../../../../ui-plugin-image/src';

@Exclude()
export class TaxonDescriptionBlockListItem {

    @Expose() id: number
    @Expose() taxonID: number
    @Expose() caption: string
    @Expose() source: string
    @Expose() sourceUrl: string
    @Expose() language: string
    @Expose() adminLanguageID: number | null
    @Expose() displayLevel: number
    @Expose() creatorUID: number
    @Expose() notes: string
    @Expose() initialTimestamp: Date
    @Type(() => TaxonDescriptionStatementListItem)
    @Expose() descriptionStatements: TaxonDescriptionStatementListItem[]
    @Type(()=> TaxonListItem)
    @Expose() taxon: TaxonListItem
    @Type(() => ImageListItem)
    @Expose() images: ImageListItem[]

    static fromJSON(blockJSON: Record<string, unknown>): TaxonDescriptionBlockListItem {
        return plainToClass(
            TaxonDescriptionBlockListItem,
            blockJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
