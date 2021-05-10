import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { OccurrenceListItem } from './occurrence-list';
import { ApiOccurrence } from '@symbiota2/data-access';

// Based on the occurrence editor fields:
// https://scan-bugs.org/portal/collections/editor/occurrenceeditor.php?csmode=0&occindex=0&occid=348864&collid=3

@Exclude()
export class OccurrenceOutputDto extends OccurrenceListItem {
    constructor(data: ApiOccurrence) {
        super(data);
        Object.assign(this, data);
    }

    // Collector info
    @ApiProperty()
    @Expose()
    otherCatalogNumbers: string;

    @ApiProperty()
    @Expose()
    recordedByNames: string;

    @ApiProperty()
    @Expose()
    recordNumber: string;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    @Transform((ds) => new Date(ds.value), { toClassOnly: true })
    eventDate: Date;

    @ApiProperty()
    @Expose()
    associatedCollectors: string;

    @ApiProperty()
    @Expose()
    verbatimEventDate: string;

    // Latest identification
    @ApiProperty()
    @Expose()
    scientificNameAuthorship: string;

    @ApiProperty()
    @Expose()
    identificationQualifier: string;

    @ApiProperty()
    @Expose()
    family: string;

    @ApiProperty()
    @Expose()
    identifiedBy: string;

    @ApiProperty()
    @Expose()
    @Type(() => Date)
    @Transform((ds) => new Date(ds.value), { toClassOnly: true })
    dateIdentified: Date;

    // Locality
    @ApiProperty()
    @Expose()
    country: string;

    @ApiProperty()
    @Expose()
    stateProvince: string;

    @ApiProperty()
    @Expose()
    municipality: string;

    @ApiProperty()
    @Expose()
    locality: string;

    @ApiProperty()
    @Expose()
    coordinateUncertaintyInMeters: number;

    @ApiProperty()
    @Expose()
    geodeticDatum: string;

    @ApiProperty()
    @Expose()
    verbatimCoordinates: string;

    @ApiProperty()
    @Expose()
    minimumElevationInMeters: number;

    @ApiProperty()
    @Expose()
    maximumElevationInMeters: number;

    @ApiProperty()
    @Expose()
    verbatimElevation: string;

    @ApiProperty()
    @Expose()
    minimumDepthInMeters: number;

    @ApiProperty()
    @Expose()
    maximumDepthInMeters: number;

    @ApiProperty()
    @Expose()
    verbatimDepth: string;

    // Misc
    @ApiProperty()
    @Expose()
    habitat: string;

    @ApiProperty()
    @Expose()
    substrate: string;

    @ApiProperty()
    @Expose()
    associatedTaxa: string;

    @ApiProperty()
    @Expose()
    verbatimAttributes: string;

    @ApiProperty()
    @Expose()
    occurrenceRemarks: string;

    @ApiProperty()
    @Expose()
    fieldNotes: string;

    @ApiProperty()
    @Expose()
    dynamicProperties: string;

    @ApiProperty()
    @Expose()
    lifeStage: string;

    @ApiProperty()
    @Expose()
    sex: string;

    @ApiProperty()
    @Expose()
    individualCount: string;

    @ApiProperty()
    @Expose()
    samplingProtocol: string;

    @ApiProperty()
    @Expose()
    preparations: string;

    @ApiProperty()
    @Expose()
    reproductiveCondition: string;

    @ApiProperty()
    @Expose()
    establishmentMeans: string;

    @ApiProperty()
    @Expose()
    @Type(() => Number)
    @Transform((cs) => parseInt(cs.value), { toClassOnly: true })
    cultivationStatus: number;

    // Curation
    @ApiProperty()
    @Expose()
    typeStatus: string;

    @ApiProperty()
    @Expose()
    disposition: string;

    @ApiProperty()
    @Expose()
    occurrenceGUID: string;

    @ApiProperty()
    @Expose()
    fieldNumber: string;

    @ApiProperty()
    @Expose()
    basisOfRecord: string;

    @ApiProperty()
    @Expose()
    language: string;

    @ApiProperty()
    @Expose()
    labelProject: string;

    @ApiProperty()
    @Expose()
    processingStatus: string;

    @ApiProperty()
    @Expose()
    dataGeneralizations: string;

    @ApiProperty()
    @Expose()
    lastModifiedTimestamp: Date;

    @ApiProperty()
    @Expose()
    recordEnteredBy: string;
}
