import { Exclude, Expose, plainToClass, Type } from 'class-transformer'

@Exclude()
export class TaxonOnlyListItem {
    @Expose() id: number
    @Expose() kingdomName: string
    @Expose() rankID: number | null
    @Expose() scientificName: string
    @Expose() unitInd1: string
    @Expose() unitName1: string
    @Expose() unitInd2: string
    @Expose() unitName2: string
    @Expose() unitInd3: string
    @Expose() unitName3: string
    @Expose() author: string
    @Expose() phyloSortSequence: number | null
    @Expose() status: string
    @Expose() source: string
    @Expose() notes: string
    @Expose() hybrid: string
    @Expose() securityStatus: number
    @Expose() lastModifiedUID: number | null
//    @Expose() lastModifiedTimestamp: Date | null
//    @Expose() initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonOnlyListItem {
        return plainToClass(
            TaxonOnlyListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
