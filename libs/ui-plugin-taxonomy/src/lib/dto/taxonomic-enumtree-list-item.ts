import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonListItem } from './taxon-list-item';
import { TaxonomicStatusListItem } from './taxon-status-list-item';
import { TaxonOnlyListItem } from './taxon-only-list-item';

@Exclude()
export class TaxonomicEnumTreeListItem {

    @Expose() taxonID: number;
    @Expose() taxonAuthorityID: number;
    @Expose() parentTaxonID: number;
    @Type(() => TaxonOnlyListItem)
    @Expose() taxon: TaxonOnlyListItem | null
    @Type(() => TaxonOnlyListItem)
    @Expose() parent: TaxonOnlyListItem | null
    @Expose() initialTimestamp: Date | null

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonomicEnumTreeListItem {
        return plainToClass(
            TaxonomicEnumTreeListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
