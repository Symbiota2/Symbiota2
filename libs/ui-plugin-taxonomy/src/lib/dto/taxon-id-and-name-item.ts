import { Exclude, Expose, plainToClass } from 'class-transformer';


@Exclude()
export class TaxonIDAndNameItem {
    @Expose() id: number
    @Expose() name: string

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonIDAndNameItem {
        return plainToClass(
            TaxonIDAndNameItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
