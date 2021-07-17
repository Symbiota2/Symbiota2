import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotUsernameInputDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
