import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class TaxonVernacularListItem {

    @Expose() id: number
    @Expose() taxonID: number
    @Expose() vernacularName: string
    @Expose() language: string
    @Expose() adminLanguageID: number | null
    @Expose() source: string
    @Expose() notes: string
    @Expose() username: string
    @Expose() isUpperTerm: number | null
    @Expose() sortSequence: number | null
    @Expose() initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonVernacularListItem {
        return plainToClass(
            TaxonVernacularListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
