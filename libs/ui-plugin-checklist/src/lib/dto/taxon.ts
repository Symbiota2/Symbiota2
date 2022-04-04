import { TaxonListItem } from './checklist-list-item'
import {
    Exclude,
    Expose,
    plainToClass,
    Transform,
    Type
} from 'class-transformer'

function dateTransformer(obj: { value: string }): Date {
    if (!!obj && !!obj.value) {
        return new Date(obj.value)
    }
    return null
}

@Exclude()
export class Taxon extends TaxonListItem {

    @Expose()
    @Transform(dateTransformer, { toClassOnly: true })
    @Type(() => Date)
    lastModifiedTimestamp: Date | null

    @Expose()
    @Transform(dateTransformer, { toClassOnly: true })
    @Type(() => Date)
    initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): Taxon {
        return plainToClass(
            Taxon,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
