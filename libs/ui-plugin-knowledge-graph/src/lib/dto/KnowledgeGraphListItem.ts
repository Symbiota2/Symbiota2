import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class KnowledgeGraphListItem {
    // Any changes to the following, also update ImageAndTaxonListItem
    @Expose() name: string

    // Any changes to the following, also update ImageAndTaxonListItem
    @Expose() updatedAt: Date | null

    @Expose() size: number | null

    static fromJSON(inputJSON: Record<string, unknown>): KnowledgeGraphListItem {
        return plainToClass(
            KnowledgeGraphListItem,
            inputJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        )
    }
}
