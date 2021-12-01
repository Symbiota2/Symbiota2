import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { TaxonListItem } from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem } from '@symbiota2/ui-plugin-image';

@Exclude()
export class TaxonomicStatusInputDto {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    @Expose() taxonID: number
    @Expose() taxonIDAccepted: number
    @Expose() taxonAuthorityID: number
    @Expose() parentTaxonID: number | null
    @Expose() hierarchyStr: string | null
    @Expose() family: string | null
    @Expose() unacceptabilityReason: string | null
    @Expose() notes: string | null
    @Expose() initialTimestamp: Date

}
