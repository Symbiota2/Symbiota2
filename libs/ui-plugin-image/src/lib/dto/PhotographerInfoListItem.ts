import { Exclude, Expose, plainToClass } from 'class-transformer'

@Exclude()
export class PhotographerInfoListItem {
    @Expose() photographerName: string
    @Expose() photographerUID: number | null

    static fromJSON(imageJSON: Record<string, unknown>): PhotographerInfoListItem {
        return plainToClass(
            PhotographerInfoListItem,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
