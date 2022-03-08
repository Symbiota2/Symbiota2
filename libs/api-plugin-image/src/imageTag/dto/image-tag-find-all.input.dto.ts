import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class ImageTagFindAllParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 1000
    static readonly DEFAULT_OFFSET = 0
    static readonly MAX_LIMIT = 5000

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @IsOptional()
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    id: number[]

    @ApiProperty({ name: 'imageId[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    imageId: number[]

    @Min(0)
    @Max(ImageTagFindAllParams.MAX_LIMIT)
    @IsOptional()
    limit: number = ImageTagFindAllParams.DEFAULT_LIMIT

    @ApiProperty({ required: false, default: ImageTagFindAllParams.DEFAULT_OFFSET })
    @Min(0)
    @IsOptional()
    offset: number = ImageTagFindAllParams.DEFAULT_OFFSET
}
