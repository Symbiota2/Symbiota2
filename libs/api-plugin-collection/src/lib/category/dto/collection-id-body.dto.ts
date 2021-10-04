import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CollectionIDBody {
    @ApiProperty()
    @IsInt()
    collectionID: number;
}
