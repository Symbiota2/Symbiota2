import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class PhotographerNameAndIDDto {
    constructor(name: PhotographerNameAndIDDto) {
        Object.assign(this, name)
    }

    @ApiProperty()
    @Expose()
    photographerName: string;

    @ApiProperty()
    @Expose()
    photographerUID: number | null;

}
