import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiChangePasswordData } from '@symbiota2/data-access';

/**
 * Object representing the body of a POST request that changes a user's password
 */
export class ChangePasswordInputDto implements ApiChangePasswordData {
    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    newPassword: string;
}
