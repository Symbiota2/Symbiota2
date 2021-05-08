import { Inject, Injectable } from '@nestjs/common';
import { Occurrence } from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
import { FindAllParams } from './dto/find-all-input.dto';
import { ApiTaxonSearchCriterion } from '@symbiota2/data-access';

type FindAllReturn = Pick<Occurrence,
    'id' | 'collectionID' | 'catalogNumber' | 'taxonID' | 'sciname' | 'latitude' | 'longitude'>;

@Injectable()
export class OccurrenceService {
    constructor(
        @Inject(Occurrence.PROVIDER_ID) private readonly occurrenceRepo: Repository<Occurrence>) {
    }

    async findAll(findAllOpts: FindAllParams): Promise<FindAllReturn[]> {
        const { limit, offset, ...params } = findAllOpts;
        let qb = this.occurrenceRepo.createQueryBuilder('o')
            .select([
                'o.id',
                'o.collectionID',
                'o.catalogNumber',
                'o.taxonID',
                'o.sciname',
                'o.latitude',
                'o.longitude'
            ])
            .take(limit)
            .skip(offset);

        if (findAllOpts.collectionID) {
            if (Array.isArray(findAllOpts.collectionID)) {
                qb = qb.where('o.collectionID IN (:...collectionID)', { collectionID: params.collectionID });
            }
            else {
                qb = qb.where('o.collectionID = :collectionID', { collectionID: params.collectionID });
            }
        }

        if (findAllOpts.taxonSearchCriterion && findAllOpts.taxonSearchStr) {
            const searchStr = `${ findAllOpts.taxonSearchStr }%`;
            switch (findAllOpts.taxonSearchCriterion) {
                case ApiTaxonSearchCriterion.familyOrSciName:
                    qb.andWhere(
                        '(o.sciname LIKE :searchStr or o.family LIKE :searchStr)',
                        { searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.sciName:
                    qb.andWhere(
                        'o.sciname LIKE :searchStr',
                        { searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.family:
                    qb.andWhere(
                        'o.family LIKE :searchStr',
                        { searchStr }
                    );
                    break;
                case ApiTaxonSearchCriterion.higherTaxonomy:
                    // TODO: Taxon plugin returns children of higher taxonomy?
                    break;
                case ApiTaxonSearchCriterion.commonName:
                    // TODO: Taxon plugin returns common names for a taxon?
                    break;
                default:
                    break;
            }
        }

        if (findAllOpts.minimumElevationInMeters !== undefined) {
            qb.andWhere(
                'o.minimumElevationInMeters = :elevation',
                { elevation: findAllOpts.minimumElevationInMeters }
            );
        }

        if (findAllOpts.maximumElevationInMeters !== undefined) {
            qb.andWhere(
                'o.maximumElevationInMeters = :elevation',
                { elevation: findAllOpts.maximumElevationInMeters }
            );
        }

        if (findAllOpts.minLatitude !== undefined) {
            qb.andWhere(
                'o.latitude >= :latitude',
                { latitude: findAllOpts.minLatitude }
            )
        }

        if (findAllOpts.minLongitude !== undefined) {
            qb.andWhere(
                'o.longitude >= :longitude',
                { longitude: findAllOpts.minLongitude }
            )
        }

        if (findAllOpts.maxLatitude !== undefined) {
            qb.andWhere(
                'o.latitude <= :latitude',
                { latitude: findAllOpts.maxLatitude }
            )
        }

        if (findAllOpts.maxLongitude !== undefined) {
            qb.andWhere(
                'o.longitude <= :longitude',
                { longitude: findAllOpts.maxLongitude }
            )
        }

        const remainingKeys = [
            'country',
            'county',
            'locality',
            'stateProvince',
        ];

        for (const searchKey of remainingKeys) {
            if (findAllOpts[searchKey]) {
                qb.andWhere(
                    `o.${ searchKey } LIKE :searchStr`,
                    { searchStr: `${ findAllOpts[searchKey] }%` }
                );
            }
        }

        return qb.getMany();
    }

    async findByID(id: number): Promise<Occurrence> {
        return await this.occurrenceRepo.findOne({ id });
    }

    async create(collectionID: number, occurrenceData: DeepPartial<Occurrence>): Promise<Occurrence> {
        const occurrence = this.occurrenceRepo.create({ collectionID, ...occurrenceData });
        return this.occurrenceRepo.save(occurrence);
    }

    async createMany(collectionID: number, occurrenceData: DeepPartial<Occurrence>[]): Promise<void> {
        const occurrences = occurrenceData.map((o) => {
            return { collectionID, ...o };
        });

        await this.occurrenceRepo.createQueryBuilder()
            .insert()
            .values(occurrences)
            .execute();
    }
}
