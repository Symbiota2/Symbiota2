import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class TaxonVernacularFindParams extends BaseFindAllParams {

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[]

    @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: false })
    @Type(() => Number)
    @IsInt({ each: true })
    @IsOptional()
    taxonAuthorityID: number

    @ApiProperty({ name: 'partialName', type: String, required: false })
    @Type(() => String)
    @IsOptional()
    partialName: string
}
