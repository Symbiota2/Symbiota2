import { Exclude, Expose} from 'class-transformer';

@Exclude()
export class TaxonDescriptionBlockInputDto {

    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    @Expose() id: number
    @Expose() taxonID: number
    @Expose() caption: string
    @Expose() source: string
    @Expose() sourceUrl: string
    @Expose() language: string
    @Expose() adminLanguageID: number | null
    @Expose() displayLevel: number
    @Expose() creatorUID: number
    @Expose() notes: string
    @Expose() initialTimestamp: Date

}
