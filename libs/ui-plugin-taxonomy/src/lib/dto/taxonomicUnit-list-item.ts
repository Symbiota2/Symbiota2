import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class TaxonomicUnitListItem {

    @Expose() id: number
    @Expose() kingdomName: string
    @Expose() rankID: number
    @Expose() rankName: string
    @Expose() suffix: string
    @Expose() directParentRankID: number
    @Expose() reqParentRankID: number | null
    @Expose() lastModifiedBy: string
    @Expose() lastModifiedTimestamp: Date | null
    @Expose() initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonomicUnitListItem {
        return plainToClass(
            TaxonomicUnitListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
