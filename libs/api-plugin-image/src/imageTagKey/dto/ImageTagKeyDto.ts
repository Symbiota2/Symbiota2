import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ImageTag, ImageTagKey } from '@symbiota2/api-database';
import { Column } from 'typeorm';

@Exclude()
export class ImageTagKeyDto {
    constructor(image: ImageTagKey) {
        Object.assign(this, image)
    }

    @ApiProperty()
    @Expose()
    tagKey: string

    @ApiProperty()
    @Expose()
    shortLabel: string

    @ApiProperty()
    @Expose()
    descriptionEn: string

    @ApiProperty()
    @Expose()
    sortOrder: number

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
