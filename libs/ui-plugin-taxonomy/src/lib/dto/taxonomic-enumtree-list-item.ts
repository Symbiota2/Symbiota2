import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonListItem } from './taxon-list-item';
import { TaxonomicStatusListItem } from './taxon-status-list-item';

@Exclude()
export class TaxonomicEnumTreeListItem {

    @Expose() taxonID: number;
    @Expose() taxonAuthorityID: number;
    @Expose() parentTaxonID: number;
    //@Expose() taxon: Promise<TaxonListItem>;
    @Type(() => TaxonListItem)
    @Expose() parent: TaxonListItem | null
    @Expose() initialTimestamp: Date | null

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonomicEnumTreeListItem {
        return plainToClass(
            TaxonomicEnumTreeListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
