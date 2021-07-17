import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordInputDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;
}
