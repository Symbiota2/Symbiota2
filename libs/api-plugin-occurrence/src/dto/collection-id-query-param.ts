import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CollectionIDQueryParam {
    @ApiProperty()
    @IsInt()
    collectionID: number;
}
