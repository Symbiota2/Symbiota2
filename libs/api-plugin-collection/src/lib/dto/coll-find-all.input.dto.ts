import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    IsArray,
    IsInt,
    IsString
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CollectionFindAllParams {
    static readonly DEFAULT_ORDER_BY = 'collectionName';

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @Transform((collectionIDs) => {
        return Number.isInteger(collectionIDs) ? [collectionIDs] : collectionIDs;
    })
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[];

    @ApiProperty({ required: false, default: CollectionFindAllParams.DEFAULT_ORDER_BY })
    @IsString()
    orderBy: string = CollectionFindAllParams.DEFAULT_ORDER_BY;
}
