import { Exclude, Expose, plainToClass } from 'class-transformer';


@Exclude()
export class TaxonIDAuthorNameItem {
    @Expose() id: number
    @Expose() name: string
    @Expose() author: string | null

    static fromJSON(taxonJSON: Record<string, unknown>): TaxonIDAuthorNameItem {
        return plainToClass(
            TaxonIDAuthorNameItem,
            taxonJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
