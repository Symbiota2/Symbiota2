import { Exclude, Expose, plainToClass } from 'class-transformer'

@Exclude()
export class TaxonDescriptionStatementListItem {

    @Expose() id: number
    @Expose() descriptionBlockID: number
    @Expose() heading: string
    @Expose() statement: string
    @Expose() displayHeader: number
    @Expose() notes: string | null;
    @Expose() sortSequence: number
    @Expose() initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonDescriptionStatementListItem {
        return plainToClass(
            TaxonDescriptionStatementListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
