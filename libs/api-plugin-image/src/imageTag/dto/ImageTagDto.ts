import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ImageTag, ImageTagKey } from '@symbiota2/api-database';

@Exclude()
export class ImageTagDto {
    constructor(image: ImageTag) {
        Object.assign(this, image)
    }

    @ApiProperty()
    @Expose()
    id: string

    @ApiProperty()
    @Expose()
    imageID: number

    @ApiProperty()
    @Expose()
    keyValueStr: string

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

    //@ApiProperty()
    //@Expose()
    //imageTagKey: ImageTagKey

}
