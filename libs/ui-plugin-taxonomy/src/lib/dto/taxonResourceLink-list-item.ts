import { Exclude, Expose, plainToClass, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonResourceLinkListItem {

    @Expose() id: number
    @Expose() taxonID: number
    @Expose() sourceName: string
    @Expose() sourceIdentifier: string | null
    @Expose() sourceGUID: string | null
    @Expose() url: string | null
    @Expose() notes: string | null
    @Expose() ranking: number | null
    @Expose() initialTimestamp: Date

    static fromJSON(blockJSON: Record<string, unknown>): TaxonResourceLinkListItem {
        return plainToClass(
            TaxonResourceLinkListItem,
            blockJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
