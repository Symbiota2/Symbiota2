import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class CollectionInputDto {
    @Expose()
    collectionCode: string;

    @Expose()
    collectionName: string;

    @Expose()
    institutionID: number;

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
    initialTimestamp: string;

    static fromFormData(data: Record<string, unknown>) {
        return plainToClass(
            CollectionInputDto,
            data,
            {
                excludeExtraneousValues: true,
                enableImplicitConversion: true
            }
        );
    }
}
