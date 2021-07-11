import { Exclude, Expose, plainToClass } from 'class-transformer';
import { TaxonListItem } from '@symbiota2/ui-plugin-taxonomy';

@Exclude()
export class TaxonomicStatusListItem {
    @Expose() taxonID: number;
    @Expose() taxonIDAccepted: number;
    @Expose() taxonAuthorityID: number;
    @Expose() parentTaxonID: number | null;
    @Expose() hierarchyStr: string | null;
    @Expose() family: string | null;
    @Expose() unacceptabilityReason: string | null;
    @Expose() notes: string | null;
    @Expose() initialTimestamp: Date;
    @Expose() children: TaxonomicStatusListItem[];
    @Expose() parent: TaxonListItem;

    static fromJSON(taxonomicStatusJSON: Record<string, unknown>): TaxonomicStatusListItem {
        return plainToClass(
            TaxonomicStatusListItem,
            taxonomicStatusJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
