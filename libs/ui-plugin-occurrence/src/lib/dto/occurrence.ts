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
    'genus' |
    'identificationQualifier' |
    'identifiedBy' |
    'scientificNameAuthorship' |
    'scientificName'
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

type MiscInfoProps = (
    'associatedTaxa' |
    'cultivationStatus' |
    'dynamicProperties' |
    'establishmentMeans' |
    'fieldNotes' |
    'habitat' |
    'individualCount' |
    'lifeStage' |
    'occurrenceRemarks' |
    'preparations' |
    'reproductiveCondition' |
    'samplingProtocol' |
    'sex' |
    'substrate' |
    'verbatimAttributes' |
    'degreeOfEstablishment'
);
interface MiscInfo extends Pick<Occurrence, MiscInfoProps> { }

type CurationInfoProps = (
    'basisOfRecord' |
    'dataGeneralizations' |
    'disposition' |
    'fieldNumber' |
    'labelProject' |
    'language' |
    'processingStatus' |
    'typeStatus'
);
interface CurationInfo extends Pick<Occurrence, CurationInfoProps> { }

@Exclude()
export class Occurrence extends OccurrenceListItem implements Partial<ApiOccurrence> {
    @Expose() associatedCollectors: string;
    @Expose() associatedOrganisms:string;
    @Expose() associatedReferences:string;
    @Expose() associatedSequence: string;
    @Expose() associatedTaxa: string;
    @Expose() basisOfRecord: string;
    @Expose() coordinateUncertaintyInMeters: number;
    @Expose() county: string;
    @Expose() country: string;
    @Expose() countryCode:string;
    @Expose() cultivationStatus: number;
    @Expose() dataGeneralizations: string;
    @Expose() dateIdentified: Date;
    @Expose() datasetName:string;
    @Expose() degreeOfEstablishment: string;
    @Expose() disposition: string;
    @Expose() dynamicProperties: string;
    @Expose() earliestAgeOrLowestAge: string;
    @Expose() earliestEonOrLowestEonothem: string;
    @Expose() earliestEpochOrLowestSeries: string;
    @Expose() earliestEraOrLowestErathem: string;
    @Expose() earliestPeriodOrLowestSystem: string;
    @Expose() establishmentMeans: string;
    @Expose() eventDate: Date;
    @Expose() eventRemarks: string;
    @Expose() eventTime:string;
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
    @Expose() measurementRemarks:string;
    @Expose() minimumDepthInMeters: number;
    @Expose() minimumElevationInMeters: number;
    @Expose() municipality: string;
    @Expose() occurrenceGUID: string;
    @Expose() occurrenceRemarks: string;
    @Expose() otherCatalogNumbers: string;
    @Expose() parentEventID:string;
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
    @Expose() subgenus:string;
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
            scientificName: this.scientificName,
            family: this.family,
            genus: this.genus,
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

    miscInfo(): MiscInfo {
        return {
            associatedTaxa: this.associatedTaxa,
            cultivationStatus: this.cultivationStatus,
            dynamicProperties: this.dynamicProperties,
            establishmentMeans: this.establishmentMeans,
            fieldNotes: this.fieldNotes,
            habitat: this.habitat,
            individualCount: this.individualCount,
            lifeStage: this.lifeStage,
            occurrenceRemarks: this.occurrenceRemarks,
            preparations: this.preparations,
            reproductiveCondition: this.reproductiveCondition,
            samplingProtocol: this.samplingProtocol,
            sex: this.sex,
            substrate: this.substrate,
            verbatimAttributes: this.verbatimAttributes,
            degreeOfEstablishment: this.degreeOfEstablishment
        };
    }

    curationInfo(): CurationInfo {
        return {
            basisOfRecord: this.basisOfRecord,
            dataGeneralizations: this.dataGeneralizations,
            disposition: this.disposition,
            fieldNumber: this.fieldNumber,
            labelProject: this.labelProject,
            language: this.language,
            processingStatus: this.processingStatus,
            typeStatus: this.typeStatus
        }
    }
}
