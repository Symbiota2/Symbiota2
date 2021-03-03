import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class OccurrenceListItem {
    @Expose() id: number;
    @Expose() catalogNumber: string;
    @Expose() collectionID: number;
    @Expose() taxonID: number;
    @Expose() sciname: string;
    @Expose() latitude: number;
    @Expose() longitude: number;

    static fromJSON(occurrenceJSON: Record<string, unknown>): OccurrenceListItem {
        return plainToClass(
            OccurrenceListItem,
            occurrenceJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
