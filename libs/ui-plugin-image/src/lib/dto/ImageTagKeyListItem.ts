import { Exclude, Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ImageTagKeyListItem {

    @Expose() tagKey: string
    @Expose() shortLabel: string
    @Expose() descriptionEn: string
    @Expose() sortOrder: number
    @Expose() initialTimestamp: Date

    static fromJSON(imageJSON: Record<string, unknown>): ImageTagKeyListItem {
        return plainToClass(
            ImageTagKeyListItem,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
