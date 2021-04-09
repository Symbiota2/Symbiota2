import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiChangePasswordData } from '@symbiota2/data-access';

export class ChangePasswordInputDto implements ApiChangePasswordData {
    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    newPassword: string;
}
