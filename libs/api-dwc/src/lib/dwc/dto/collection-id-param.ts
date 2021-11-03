import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CollectionIDParam {
    @ApiProperty()
    @IsInt()
    collectionID: number;
}
