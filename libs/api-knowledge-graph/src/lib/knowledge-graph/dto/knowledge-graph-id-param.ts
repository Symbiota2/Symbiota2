import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class KnowledgeGraphIdParam {
    @ApiProperty()
    @IsInt()
    graphID: number;
}
