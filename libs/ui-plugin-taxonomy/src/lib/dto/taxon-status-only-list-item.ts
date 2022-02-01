import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonOnlyListItem } from './taxon-only-list-item';

@Exclude()
export class TaxonomicStatusOnlyListItem {
    @Expose() taxonID: number
    @Expose() taxonIDAccepted: number
    @Expose() taxonAuthorityID: number
    @Expose() parentTaxonID: number | null
    @Expose() hierarchyStr: string | null
    @Expose() family: string | null
    @Expose() unacceptabilityReason: string | null
    @Expose() notes: string | null
    @Expose() initialTimestamp: Date
    @Type(() => TaxonOnlyListItem)
    @Expose() taxon: TaxonOnlyListItem | null

    static fromJSON(taxonomicStatusJSON: Record<string, unknown>): TaxonomicStatusOnlyListItem {
        return plainToClass(
            TaxonomicStatusOnlyListItem,
            taxonomicStatusJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
