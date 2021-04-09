import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ApiLoginResponse } from '@symbiota2/data-access';

export class AccessTokenOutputDto implements ApiLoginResponse {
    @ApiProperty()
    @Expose()
    accessToken: string;
}
