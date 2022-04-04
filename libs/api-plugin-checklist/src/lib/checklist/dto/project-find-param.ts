import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

// export class ProjectFindCommonParams extends BaseFindAllParams {
//     static readonly DEFAULT_LIMIT = 20
//     static readonly DEFAULT_OFFSET = 0
//     static readonly MAX_LIMIT = 20000

//     @Min(0)
//     @Max(ProjectFindCommonParams.MAX_LIMIT)
//     limit: number = ProjectFindCommonParams.DEFAULT_LIMIT

//     @ApiProperty({ required: false, default: ProjectFindCommonParams.DEFAULT_OFFSET })
//     @Min(0)
//     offset: number = ProjectFindCommonParams.DEFAULT_OFFSET
// }
// export class ChecklistFindNamesParams extends ChecklistFindCommonParams {

//     @ApiProperty({ name: 'id[]', type: [Number], required: false })
//     @Type(() => Number)
//     @IsArray()
//     @IsInt({ each: true })
//     @IsOptional()
//     id: number[]

//     @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: false })
//     @Type(() => Number)
//     @IsInt({ each: true })
//     @IsOptional()
//     taxonAuthorityID: number

//     @ApiProperty({ name: 'partialName', type: String, required: false })
//     @Type(() => String)
//     @IsOptional()
//     partialName: string

//     @ApiProperty({ name: 'withImages', type: String, required: false })
//     @Type(() => String)
//     @IsOptional()
//     withImages: string

//     @ApiProperty({ name: 'kingdom', type: String, required: false })
//     @Type(() => String)
//     @IsOptional()
//     kingdom: string

//     @ApiProperty({ name: 'rankID', type: Number, required: false })
//     @Type(() => Number)
//     @IsInt({ each: true })
//     @IsOptional()
//     rankID: string
// }

// export class ProjectFindAllParams extends BaseFindCommonParams {
export class ProjectFindAllParams extends BaseFindAllParams {
    @ApiProperty({ name: 'name', type: String })
    @Type(() => String)
    @IsOptional()
    name: string;

    @ApiProperty({ name: 'managers', type: String })
    @Type(() => String)
    @IsOptional()
    managers: string;

    @ApiProperty({ name: 'briefDescription', type: String })
    @Type(() => String)
    @IsOptional()
    briefDescription: string;

    // @ApiProperty({ name: 'id[]', type: [Number], required: false })
    // @Type(() => Number)
    // @IsArray()
    // @IsInt({ each: true })
    // @IsOptional()
    // id: number[]

    // @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: false })
    // @Type(() => Number)
    // @IsInt({ each: true })
    // @IsOptional()
    // taxonAuthorityID: number

    // @ApiProperty({ name: 'scientificName', type: String, required: false })
    // @Type(() => String)
    // @IsOptional()
    // scientificName: string

}
