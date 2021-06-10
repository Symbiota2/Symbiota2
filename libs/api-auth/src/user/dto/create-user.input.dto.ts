import { UserInputDto } from "./user.input.dto";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiCreateUserData } from '@symbiota2/data-access';

/**
 * Object representing a new user. Contains profile data and a username and
 * password.
 */
export class CreateUserInputDto extends UserInputDto implements ApiCreateUserData {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}
