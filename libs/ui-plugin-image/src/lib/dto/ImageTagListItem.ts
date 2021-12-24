import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class ImageTagListItem {

    @Expose() id: string
    @Expose() imageID: number
    @Expose() keyValueStr: string
    @Expose() initialTimestamp: Date
    //@Expose() imageTagKey: ImageTagKeyListItem

    static fromJSON(imageJSON: Record<string, unknown>): ImageTagListItem {
        return plainToClass(
            ImageTagListItem,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
