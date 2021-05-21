import { OccurrenceListItem } from './occurrence-list-item';
import {
    Exclude,
    Expose,
    plainToClass,
    Transform,
    Type
} from 'class-transformer';
import { ApiOccurrence } from '@symbiota2/data-access';

type CollectorInfoProps = (
    'associatedCollectors' |
    'basisOfRecord' |
    'catalogNumber' |
    'eventDate' |
    'otherCatalogNumbers' |
    'recordedByNames' |
    'recordNumber' |
    'verbatimEventDate'
);
interface CollectorInfo extends Pick<Occurrence, CollectorInfoProps> { }

type LatestIDInfoProps = (
    'dateIdentified' |
    'family' |
    'identificationQualifier' |
    'identifiedBy' |
    'scientificNameAuthorship' |
    'sciname'
);
interface LatestIDInfo extends Pick<Occurrence, LatestIDInfoProps> { }

type LocalityInfoProps = (
    'coordinateUncertaintyInMeters' |
    'country' |
    'county' |
    'geodeticDatum' |
    'latitude' |
    'locality' |
    'longitude' |
    'maximumDepthInMeters' |
    'maximumElevationInMeters' |
    'minimumDepthInMeters' |
    'minimumElevationInMeters' |
    'municipality' |
    'stateProvince' |
    'verbatimCoordinates' |
    'verbatimDepth'
);
interface LocalityInfo extends Pick<Occurrence, LocalityInfoProps> { }

@Exclude()
export class Occurrence extends OccurrenceListItem implements Partial<ApiOccurrence> {
    @Expose() associatedCollectors: string;
    @Expose() associatedTaxa: string;
    @Expose() basisOfRecord: string;
    @Expose() coordinateUncertaintyInMeters: number;
    @Expose() county: string;
    @Expose() country: string;
    @Expose() cultivationStatus: number;
    @Expose() dataGeneralizations: string;
    @Expose() dateIdentified: Date;
    @Expose() disposition: string;
    @Expose() dynamicProperties: string;
    @Expose() establishmentMeans: string;
    @Expose() eventDate: Date;
    @Expose() family: string;
    @Expose() fieldNotes: string;
    @Expose() fieldNumber: string;
    @Expose() genus: string;
    @Expose() geodeticDatum: string;
    @Expose() habitat: string;
    @Expose() identificationQualifier: string;
    @Expose() identifiedBy: string;
    @Expose() individualCount: string;
    @Expose() labelProject: string;
    @Expose() language: string;
    @Expose() lastModifiedTimestamp: Date;
    @Expose() lifeStage: string;
    @Expose() locality: string;
    @Expose() maximumDepthInMeters: number;
    @Expose() maximumElevationInMeters: number;
    @Expose() minimumDepthInMeters: number;
    @Expose() minimumElevationInMeters: number;
    @Expose() municipality: string;
    @Expose() occurrenceGUID: string;
    @Expose() occurrenceRemarks: string;
    @Expose() otherCatalogNumbers: string;
    @Expose() preparations: string;
    @Expose() processingStatus: string;
    @Expose() recordedByNames: string;
    @Expose() recordEnteredBy: string;
    @Expose() recordNumber: string;
    @Expose() reproductiveCondition: string;
    @Expose() samplingProtocol: string;
    @Expose() scientificNameAuthorship: string;
    @Expose() sex: string;
    @Expose() specificEpithet: string;
    @Expose() stateProvince: string;
    @Expose() substrate: string;
    @Expose() typeStatus: string;
    @Expose() verbatimAttributes: string;
    @Expose() verbatimCoordinates: string;
    @Expose() verbatimDepth: string;
    @Expose() verbatimElevation: string;
    @Expose() verbatimEventDate: string;

    static fromJSON(occurrenceJSON: Record<string, unknown>): Occurrence {
        return plainToClass(
            Occurrence,
            occurrenceJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }

    collectorInfo(): CollectorInfo {
        return {
            catalogNumber: this.catalogNumber,
            eventDate: this.eventDate,
            recordedByNames: this.recordedByNames,
            basisOfRecord: this.basisOfRecord,
            associatedCollectors: this.associatedCollectors,
            otherCatalogNumbers: this.otherCatalogNumbers,
            recordNumber: this.recordNumber,
            verbatimEventDate: this.verbatimEventDate
        };
    }

    latestIDInfo(): LatestIDInfo {
        return {
            identificationQualifier: this.identificationQualifier,
            scientificNameAuthorship: this.scientificNameAuthorship,
            sciname: this.sciname,
            family: this.family,
            dateIdentified: this.dateIdentified,
            identifiedBy: this.identifiedBy
        };
    }

    localityInfo(): LocalityInfo {
        return {
            coordinateUncertaintyInMeters: this.coordinateUncertaintyInMeters,
            country: this.country,
            county: this.county,
            geodeticDatum: this.geodeticDatum,
            latitude: this.latitude,
            locality: this.locality,
            longitude: this.longitude,
            maximumDepthInMeters: this.maximumDepthInMeters,
            maximumElevationInMeters: this.maximumElevationInMeters,
            minimumDepthInMeters: this.minimumDepthInMeters,
            minimumElevationInMeters: this.minimumElevationInMeters,
            municipality: this.municipality,
            stateProvince: this.stateProvince,
            verbatimCoordinates: this.verbatimCoordinates,
            verbatimDepth: this.verbatimDepth
        }
    }
}
