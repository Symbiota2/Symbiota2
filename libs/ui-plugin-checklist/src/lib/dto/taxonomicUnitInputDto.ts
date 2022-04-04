import { Exclude, Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonomicUnitInputDto {

    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

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

}
