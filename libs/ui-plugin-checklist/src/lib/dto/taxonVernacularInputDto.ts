import { Exclude, Expose} from 'class-transformer';
import { TaxonVernacularListItem } from '@symbiota2/ui-plugin-taxonomy';

@Exclude()
export class TaxonVernacularInputDto {

    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    @Expose() id: number
    @Expose() taxonID: number
    @Expose() vernacularName: string
    @Expose() language: string
    @Expose() adminLanguageID: number | null
    @Expose() source: string
    @Expose() notes: string
    @Expose() username: string
    @Expose() isUpperTerm: number | null
    @Expose() sortSequence: number | null
    @Expose() initialTimestamp: Date

}
