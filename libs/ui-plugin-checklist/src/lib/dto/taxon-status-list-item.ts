import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonListItem } from './checklist-list-item';

@Exclude()
export class TaxonomicStatusListItem {
    @Expose() taxonID: number
    @Expose() taxonIDAccepted: number
    @Expose() taxonAuthorityID: number
    @Expose() parentTaxonID: number | null
    @Expose() hierarchyStr: string | null
    @Expose() family: string | null
    @Expose() unacceptabilityReason: string | null
    @Expose() notes: string | null
    @Expose() initialTimestamp: Date
    @Type(() => TaxonomicStatusListItem)
    @Expose() children: TaxonomicStatusListItem[] | []
    @Type(() => TaxonListItem)
    @Expose() parent: TaxonListItem | null
    @Type(() => TaxonListItem)
    @Expose() taxon: TaxonListItem | null

    static fromJSON(taxonomicStatusJSON: Record<string, unknown>): TaxonomicStatusListItem {
        return plainToClass(
            TaxonomicStatusListItem,
            taxonomicStatusJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
