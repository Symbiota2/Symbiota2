import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiChangePasswordData } from '@symbiota2/data-access';

/**
 * Object representing the body of a POST request that changes a user's password
 */
export class ChangePasswordInputDto implements ApiChangePasswordData {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
