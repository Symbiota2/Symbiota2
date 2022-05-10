import { ChecklistProjectLink } from '@symbiota2/api-database';
import { Exclude, Expose, plainToClass } from 'class-transformer';


@Exclude()
export class ChecklistTaxonLinkDto {
    @Expose() scientificName: string
    @Expose() familyOverride: string
    @Expose() habitat: string
    @Expose() abundance: string
    @Expose() notes: string
    @Expose() internalNotes: string
    @Expose() source: string

    static fromJSON(checklisTaxonLinkJson: Record<string, unknown>): ChecklistTaxonLinkDto {
        return plainToClass(
            ChecklistTaxonLinkDto,
            checklisTaxonLinkJson,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}