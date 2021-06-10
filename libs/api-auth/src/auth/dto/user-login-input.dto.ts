import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiLoginRequest } from '@symbiota2/data-access';

/**
 * Object that should be sent to the login route
 */
export class UserLoginInputDto implements ApiLoginRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}
