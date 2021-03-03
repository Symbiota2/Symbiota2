import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccessTokenOutputDto {
    @ApiProperty()
    @Expose()
    accessToken: string;
}
