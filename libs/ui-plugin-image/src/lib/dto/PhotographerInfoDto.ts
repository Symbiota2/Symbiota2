import { Exclude, Expose, plainToClass } from 'class-transformer'

@Exclude()
export class PhotographerInfoDto {
    @Expose() photographerName: string
    @Expose() photographerUID: number | null

    static fromJSON(imageJSON: Record<string, unknown>): PhotographerInfoDto {
        return plainToClass(
            PhotographerInfoDto,
            imageJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
