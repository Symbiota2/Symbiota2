import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Collection, Institution } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import {
    ApiCollectionInstitutionOutput, ApiCollectionOutput,
    ApiCollectionStatsOutput
} from '@symbiota2/data-access';
import { CollectionListItem } from './CollectionListItem.output.dto';

@Exclude()
export class CollectionInstitutionOutputDto implements ApiCollectionInstitutionOutput {
    constructor(institution: Institution) {
        Object.assign(this, institution);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    code: string;

    @ApiProperty()
    @Expose()
    name: string;
}

@Exclude()
export class CollectionStatsOutputDto implements ApiCollectionStatsOutput {
    constructor(collectionStats: CollectionStatsOutputDto) {
        Object.assign(this, collectionStats);
    }

    @ApiProperty()
    @Expose()
    familyCount: number;

    @ApiProperty()
    @Expose()
    genusCount: number;

    @ApiProperty()
    @Expose()
    speciesCount: number;

    @ApiProperty()
    @Expose()
    recordCount: number;

    @ApiProperty()
    @Expose()
    georeferencedCount: number;

    @ApiProperty()
    @Expose()
    lastModifiedTimestamp: Date;
}

@Exclude()
export class CollectionOutputDto extends CollectionListItem implements ApiCollectionOutput {
    constructor(collection: Collection) {
        super(collection);
    }

    @ApiProperty()
    @Expose()
    collectionCode: string;

    @ApiProperty()
    @Expose()
    @Type(() => CollectionInstitutionOutputDto)
    institution: CollectionInstitutionOutputDto;

    @ApiProperty()
    @Expose()
    @Type(() => CollectionStatsOutputDto)
    stats: CollectionStatsOutputDto;

    @ApiProperty()
    @Expose()
    fullDescription: string;

    @ApiProperty()
    @Expose()
    homePage: string;

    @ApiProperty()
    @Expose()
    individualUrl: string;

    @ApiProperty()
    @Expose()
    contact: string;

    @ApiProperty()
    @Expose()
    email: string;

    // Lat/Lng numbers are too long for JS
    @ApiProperty()
    @Expose()
    @Type(() => String)
    @Transform((data) => data ? parseFloat(data.value) : null)
    latitude: number;

    @ApiProperty()
    @Expose()
    @Type(() => String)
    @Transform((data) => data ? parseFloat(data.value) : null)
    longitude: number;

    @ApiProperty()
    @Expose()
    type: string;

    @ApiProperty()
    @Expose()
    managementType: string;

    @ApiProperty()
    @Expose()
    rightsHolder: string;

    @ApiProperty()
    @Expose()
    rights: string;

    @ApiProperty()
    @Expose()
    usageTerm: string;

    @ApiProperty()
    @Expose()
    accessRights: string;

    @ApiProperty()
    @Expose()
    initialTimestamp: Date;
}
