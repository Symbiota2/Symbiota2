import {Inject, Injectable} from '@nestjs/common';
import { Occurrence } from '@symbiota2/api-database';
import { Repository, DeepPartial } from 'typeorm';
import { FindAllParams } from './dto/find-all-input.dto';

@Injectable()
export class OccurrenceService {
    constructor(
        @Inject(Occurrence.PROVIDER_ID) private readonly occurrenceRepo: Repository<Occurrence>) { }

    async findAll(findAllOpts: FindAllParams): Promise<Occurrence[]> {
        const { limit, offset, ...params } = findAllOpts;
        let qb = this.occurrenceRepo.createQueryBuilder()
            .select()
            .take(limit)
            .offset(offset);

        if (findAllOpts.collectionID) {
            if (Array.isArray(findAllOpts.collectionID)) {
                qb = qb.where('collid IN (:...collectionID)', { collectionID: params.collectionID });
            }
            else {
                qb = qb.where('collid = :collectionID', { collectionID: params.collectionID });
            }
        }

        if (findAllOpts.catalogNumber) {
            qb = qb.andWhere(
                'catalogNumber LIKE :catalogNumber',
                { catalogNumber: `${params.catalogNumber}%` }
            );
        }

        if (findAllOpts.scientificName) {
            qb = qb.andWhere(
                'sciname LIKE :sciname',
                { sciname: `%${findAllOpts.scientificName}%` }
            );
        }

        if (findAllOpts.latitudeGt) {
            qb = qb.andWhere(
                'decimalLatitude >= :latGt',
                { latGt: findAllOpts.latitudeGt }
            );
        }

        if (findAllOpts.latitudeLt) {
            qb = qb.andWhere(
                'decimalLatitude <= :latLt',
                { latLt: findAllOpts.latitudeLt }
            );
        }

        if (findAllOpts.longitudeGt) {
            qb = qb.andWhere(
                'decimalLongitude >= :lonGt',
                { lonGt: findAllOpts.longitudeGt }
            );
        }

        if (findAllOpts.longitudeLt) {
            qb = qb.andWhere(
                'decimalLongitude <= :lonLt',
                { lonLt: findAllOpts.longitudeLt }
            );
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
            return { collectionID, ...o }
        });

        await this.occurrenceRepo.createQueryBuilder()
            .insert()
            .values(occurrences)
            .execute();
    }
}
