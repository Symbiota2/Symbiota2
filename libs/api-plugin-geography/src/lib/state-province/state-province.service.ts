import { Inject, Injectable } from '@nestjs/common';
import { GeoThesuarusStateProvince } from '@symbiota2/api-database';
import { FindManyOptions, Like, Repository } from 'typeorm';

type FindOneOutput = Pick<GeoThesuarusStateProvince, 'id' | 'countryID' | 'acceptedID' | 'stateTerm' | 'footprintWKT'>;
type FindAllOutput = Pick<GeoThesuarusStateProvince, 'id' | 'countryID' | 'stateTerm'>;

@Injectable()
export class StateProvinceService {
    constructor(
        @Inject(GeoThesuarusStateProvince.PROVIDER_ID)
        private readonly provinceRepo: Repository<GeoThesuarusStateProvince>) { }

    async findAll(limit: number, offset: number, countryID: number = null, stateTerm: string = null): Promise<FindAllOutput[]> {
        const queryArgs: FindManyOptions<GeoThesuarusStateProvince> = {
            select: ['id', 'countryID', 'stateTerm'],
            order: { 'stateTerm': 'ASC' },
            take: limit,
            skip: offset,
            where: {}
        };

        if (countryID) {
            queryArgs.where['countryID'] = countryID;
        }

        if (stateTerm) {
            queryArgs.where['stateTerm'] = Like(`${stateTerm}%`);
        }

        return this.provinceRepo.find(queryArgs);
    }

    async findOne(id: number): Promise<FindOneOutput> {
        return this.provinceRepo.findOne(id, {
            select: [
                'id',
                'countryID',
                'acceptedID',
                'stateTerm',
                'footprintWKT'
            ]
        });
    }
}
