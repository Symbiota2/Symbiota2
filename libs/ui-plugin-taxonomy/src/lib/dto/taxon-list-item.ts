import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonomicStatusOnlyListItem } from './taxon-status-only-list-item';

@Exclude()
export class TaxonListItem {
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
    @Type(() => TaxonomicStatusOnlyListItem)
    @Expose() acceptedTaxonStatuses: TaxonomicStatusOnlyListItem[] | []
    @Expose() securityStatus: number
    @Expose() lastModifiedUID: number | null
//    @Expose() lastModifiedTimestamp: Date | null
//    @Expose() initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonListItem {
        return plainToClass(
            TaxonListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
