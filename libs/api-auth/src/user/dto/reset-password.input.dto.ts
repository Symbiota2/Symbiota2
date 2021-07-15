import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordInputDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;
}
