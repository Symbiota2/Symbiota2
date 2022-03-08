import { Exclude, Expose, plainToClass, Type } from 'class-transformer'

@Exclude()
export class TaxonLinkListItem {

    @Expose() id: number
    @Expose() taxonID: number
    @Expose() url: string
    @Expose() title: string
    @Expose() sourceIdentifier: string | null
    @Expose() owner: string | null
    @Expose() icon: string | null
    @Expose() inherit: number | null
    @Expose() notes: string | null
    @Expose() sortSequence: number
    @Expose() initialTimestamp: Date

    static fromJSON(blockJSON: Record<string, unknown>): TaxonLinkListItem {
        return plainToClass(
            TaxonLinkListItem,
            blockJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
