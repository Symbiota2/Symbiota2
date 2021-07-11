import { Exclude, Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ImageListItem {
    @Expose() id: number
    @Expose() taxonID: number | null
    @Expose() url: string
    @Expose() thumbnailUrl: string
    @Expose() originalUrl: string
    @Expose() archiveUrl: string
    @Expose() photographerName: string
    @Expose() photographerUID: number | null
    @Expose() type: string
    @Expose() format: string
    @Expose() caption: string
    @Expose() owner: string
    @Expose() sourceUrl: string
    @Expose() referenceUrl: string
    @Expose() copyright: string
    @Expose() rights: string
    @Expose() accessRights: string
    @Expose() locality: string
    @Expose() occurrenceID: number | null
    @Expose() notes: string
    @Expose() anatomy: string
    @Expose() username: string
    @Expose() sourceIdentifier: string
    @Expose() mediaMD5: string
    @Expose() dynamicProperties: string
    @Expose() sortSequence: number
    @Expose() initialTimestamp: Date

    static fromJSON(imageJSON: Record<string, unknown>): ImageListItem {
        return plainToClass(
            ImageListItem,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
