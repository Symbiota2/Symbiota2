import { Exclude, Expose, plainToClass } from 'class-transformer'

@Exclude()
export class TaxonDescriptionStatementInputDto {

    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    @Expose() id: number
    @Expose() descriptionBlockID: number
    @Expose() heading: string
    @Expose() statement: string
    @Expose() displayHeader: number
    @Expose() notes: string | null;
    @Expose() sortSequence: number
    @Expose() initialTimestamp: Date

}
