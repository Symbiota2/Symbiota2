import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class TaxonomicEnumTreeListItem {

    @Expose() taxonID: number;
    @Expose() taxonAuthorityID: number;
    @Expose() parentTaxonID: number;
    //@Expose() taxon: Promise<TaxonListItem>;
    //@Expose() parent: TaxonListItem;
    @Expose() initialTimestamp: Date;

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonomicEnumTreeListItem {
        return plainToClass(
            TaxonomicEnumTreeListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
