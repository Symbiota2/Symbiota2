import { Inject, Injectable } from '@nestjs/common';
import { GeoThesuarusStateProvince } from '@symbiota2/api-database';
import { Repository } from 'typeorm';

type FindCountry = { id: number; countryTerm: string };
type FindOneOutput = Pick<GeoThesuarusStateProvince, 'id' | 'acceptedID' | 'stateTerm' | 'footprintWKT'> & { country: FindCountry };
type FindAllOutput = Pick<GeoThesuarusStateProvince, 'id' | 'stateTerm'> & { country: FindCountry };

/**
 * Service for retrieving states/provinces from the database
 */
@Injectable()
export class StateProvinceService {
    constructor(
        @Inject(GeoThesuarusStateProvince.PROVIDER_ID)
        private readonly provinceRepo: Repository<GeoThesuarusStateProvince>) { }

    /**
     * Retrieve a list of provinces from the database
     * @param limit Maximum number of provinces to retrieve
     * @param offset Offset for the list
     * @param countryID The country in which the provinces are located
     * @param stateTerm The name of the state
     * @return Promise<FindAllOutput[]> The list of provinces matching the query
     */
    async findAll(limit: number, offset: number, countryID: number = null, stateTerm: string = null): Promise<FindAllOutput[]> {
        const queryBuilder = this.provinceRepo.createQueryBuilder('p')
            .select(['p.id', 'p.stateTerm', 'c.id', 'c.countryTerm'])
            .innerJoin('p.country', 'c')
            .take(limit)
            .skip(offset)
            .orderBy({ 'p.stateTerm': 'ASC' })

        if (countryID) {
            queryBuilder.andWhere('p.countryID = :countryID', { countryID });
        }

        if (stateTerm) {
            queryBuilder.andWhere('p.stateTerm LIKE :stateTerm', { stateTerm: `${stateTerm}%` });
        }

        const results = await queryBuilder.getMany();
        return Promise.all(
            results.map(async (province) => {
                const { country, ...props } = province;
                return {
                    ...props,
                    country: await country
                };
            })
        );
    }

    /**
     * Retrieve a specific province by ID
     * @param id The ID of the province
     * @return Promise<FindOneOutput> The province with the given ID
     */
    async findOne(id: number): Promise<FindOneOutput> {
        const province = await this.provinceRepo.createQueryBuilder('p')
            .select([
                'p.id',
                'p.stateTerm',
                'p.acceptedID',
                'p.footprintWKT',
                'c.id',
                'c.countryTerm'
            ])
            .innerJoin('p.country', 'c')
            .where({ id })
            .getOne();

        const { country, ...props } = province;
        return {
            ...props,
            country: await country
        };
    }
}
