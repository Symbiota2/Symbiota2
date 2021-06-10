import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ApiLoginResponse } from '@symbiota2/data-access';

/**
 * DTO for returning an access token to the user
 */
export class AccessTokenOutputDto implements ApiLoginResponse {
    @ApiProperty()
    @Expose()
    accessToken: string;
}
