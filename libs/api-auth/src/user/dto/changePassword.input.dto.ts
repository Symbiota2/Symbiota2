import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiInputChangePassword } from '@symbiota2/data-access';

export class ChangePasswordInputDto implements ApiInputChangePassword {
    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    newPassword: string;
}
