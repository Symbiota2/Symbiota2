import {
    Exclude,
    Expose,
    plainToClass,
    Transform,
    Type
} from 'class-transformer';

@Exclude()
class CollectionInstitution {
    @Expose()
    id: number;

    @Expose()
    name: string;
}

@Exclude()
class CollectionStats {
    @Expose()
    familyCount: number;

    @Expose()
    genusCount: number;

    @Expose()
    speciesCount: number;

    @Expose()
    recordCount: number;

    @Expose()
    georeferencedCount: number;

    @Expose()
    @Type(() => Date)
    lastModifiedTimestamp: Date;
}

@Exclude()
export class CollectionListItem {
    constructor(collection: Record<string, unknown>) {
        const asCls = plainToClass(CollectionListItem, collection);
        Object.assign(this, asCls);
    }

    @Expose()
    id: number;

    @Expose()
    collectionName: string;

    @Expose()
    icon: string;
}

@Exclude()
export class Collection {
    constructor(collection: Record<string, unknown>) {
        const asCls = plainToClass(Collection, collection);
        Object.assign(this, asCls);
    }

    @Expose()
    id: number;

    @Expose()
    collectionCode: string;

    @Expose()
    collectionName: string;

    @Expose()
    @Type(() => CollectionInstitution)
    institution: CollectionInstitution;

    @Expose()
    @Type(() => CollectionStats)
    stats: CollectionStats;

    @Expose()
    fullDescription: string;

    @Expose()
    homePage: string;

    @Expose()
    individualUrl: string;

    @Expose()
    contact: string;

    @Expose()
    email: string;

    @Expose()
    latitude: number;

    @Expose()
    longitude: number;

    @Expose()
    icon: string;

    @Expose()
    type: string;

    @Expose()
    managementType: string;

    @Expose()
    rightsHolder: string;

    @Expose()
    rights: string;

    @Expose()
    usageTerm: string;

    @Expose()
    accessRights: string;

    @Expose()
    @Type(() => Date)
    initialTimestamp: Date;
}
