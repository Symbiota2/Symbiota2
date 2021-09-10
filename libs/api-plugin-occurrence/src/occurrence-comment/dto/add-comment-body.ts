import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    comment: string;
}
