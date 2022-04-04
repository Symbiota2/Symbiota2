import { Exclude, Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonomicAuthorityListItem {

    @Expose() id: number
    @Expose() name: string
    @Expose() isPrimary: number
    @Expose() description: string | null
    @Expose() editors: string | null
    @Expose() contact: string | null
    @Expose() email: string | null
    @Expose() url: string | null
    @Expose() notes: string | null
    @Expose() isActive: number
    @Expose() initialTimestamp: Date

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonomicAuthorityListItem {
        return plainToClass(
            TaxonomicAuthorityListItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
