import { UserInputDto } from "./user.input.dto";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiInputCreateUser } from '@symbiota2/data-access';

export class CreateUserInputDto extends UserInputDto implements ApiInputCreateUser {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}
