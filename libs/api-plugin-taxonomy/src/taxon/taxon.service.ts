import { Inject, Injectable, Logger } from '@nestjs/common';
import { Taxon, TaxonomicUnit } from '@symbiota2/api-database';
import { In, Like, Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common'
import { DwCArchiveParser, dwcCoreID, getDwcField, isDwCID } from '@symbiota2/dwc';
import { TaxonFindAllParams, TaxonFindNamesParams } from './dto/taxon-find-parms';

@Injectable()
export class TaxonService extends BaseService<Taxon>{
    private static readonly UPLOAD_CHUNK_SIZE = 1024;
    private static readonly LOGGER = new Logger(TaxonService.name);

    constructor(
        @Inject(Taxon.PROVIDER_ID) private readonly taxonRepo: Repository<Taxon>,
        @Inject(TaxonomicUnit.PROVIDER_ID) private readonly rankRepo: Repository<TaxonomicUnit>) {
        super(taxonRepo);
    }

    /**
     * Service to find all of the taxons possibly using an array of ids and a taxonomic authority ID
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonAllParams'
     * @param params - the 'TaxonAllParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonAllParams
     */
    async findAll(params?: TaxonFindAllParams): Promise<Taxon[]> {
        const { limit, offset, ...qParams } = params

        if (qParams.taxonAuthorityID) {
            // Have to use query builder since filter on nested relations does not work
            const qb = this.taxonRepo.createQueryBuilder('o')
                .leftJoin('o.taxonStatuses', 'c')
                //.take(limit)

                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            } else {
                // limit only if we don't have a list of ids
                qb.take(limit)
                qb.skip(offset)
            }
            return qb.getMany()
        } else {
            // Can use nested relations
            return (qParams.id)?
                await this.taxonRepo.find({
                    // No limit or offset if we have a list of ids
                    // take: limit,
                    // skip: offset,
                    where: { id: In(params.id) }})
                : await this.taxonRepo.find({
                    take: limit,
                    skip: offset })
        }
    }

    /**
     * Find all of the taxons possibly using an array of ids and
     * a taxonomic authority ID, and include the authors with the result
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findAllScientificNamesPlusAuthors(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params
        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName',
                    'o.author'
                ])
                .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
                .innerJoin('o.taxonStatuses', 'c')
                .where(
                    'c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID }
                )

            if (qParams.id) {
                qb.andWhere(
                    'o.id IN (:...taxonIDs)',
                    {taxonIDs: params.id}
                )
            }

            if (qParams.partialName) {
                qb.andWhere(
                    'o.scientificName LIKE :name',
                    {name: params.partialName + '%'}
                )
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "author"],
                    where: { id: In(params.id) },
                    take: TaxonFindAllParams.MAX_LIMIT})
                : await this.taxonRepo.find({
                    select: ["scientificName", "author"],
                    take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /**
     * Find all of the scientific names of taxons possibly using an array of ids and
     * a taxonomic authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findAllScientificNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName'
                ])
                .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName"],
                    where: { id: In(params.id) },
                    take: TaxonFindAllParams.MAX_LIMIT})
                : await this.taxonRepo.find({
                    select: ["scientificName"],
                    take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /**
     * Project the sciname from the taxa table for the rank of family using possibly
     * a list of taxaIDs and an authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findFamilyNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName', 'o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 140 }) // [TODO Get the actual family rank id]

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "id"],
                    where: { id: In(params.id), rankID: 140 } // [TODO Get the actual family rank id]
                })
                : await this.taxonRepo.find({
                    select: ["scientificName","id"],
                    where: { rankID: 140 } // [TODO Get the actual family rank id]
                })
        }
    }

    /**
     * Project the sciname from the taxa table for the rank of genus using possibly
     * a list of taxaIDs and an authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findGenusNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName','o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 180 }) // [TODO Get the actual genus rank id]

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "id"],
                    where: { id: In(params.id), rankID: 180 } // [TODO Get the actual genus rank id]
                })
                : await this.taxonRepo.find({
                    select: ["scientificName","id"],
                    where: { rankID: 180 } // [TODO Get the actual genus rank id]
                })
        }
    }

    /**
     * Project the sciname from the taxa table for the rank of species using possibly
     * a list of taxaIDs and an authority ID
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findSpeciesNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName', 'o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 220 }) // [TODO Get the actual genus rank id]

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                (qParams.partialName)?
                    await this.taxonRepo.find({
                        select: ["scientificName", "id"],
                        where: { id: In(params.id),
                            rankID: 220, // [TODO Get the actual genus rank id]
                            scientificName: Like(params.partialName + '%') }
                    })
                    : await this.taxonRepo.find({
                        select: ["scientificName", "id"],
                        where: { id: In(params.id), rankID: 220 } // [TODO Get the actual genus rank id]
                    })
                : (qParams.partialName)?
                    await this.taxonRepo.find({
                        select: ["scientificName","id"],
                        where: {
                            rankID: 220, // [TODO Get the actual genus rank id]
                            scientificName: Like(params.partialName + '%')
                        }
                    })
                    : await this.taxonRepo.find({
                        select: ["scientificName","id"],
                        where: { rankID: 220 } // [TODO Get the actual genus rank id]
                    })
        }
    }

    /**
     * Find the taxons that match a given scientific name, possibly using an authority id
     * Set find params using the 'TaxonFindNamesParams'
     * @param params - the 'TaxonFindNamesParams'
     * @returns Observable of response from api casted as `Taxon[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see Taxon
     * @see TaxonFindNamesParams
     */
    async findByScientificName(sciname: string, params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use the query builder since where filter on nested relations does not work
            const qb = this.taxonRepo.createQueryBuilder('o')
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
                .andWhere('o.scientificName = :sciname', {sciname: sciname})

            return await qb.getMany()
        } else {
            return await this.taxonRepo.find({ where: { scientificName: sciname } })
        }
    }

    /**
     * Find a taxon and its synonyms using a taxon ID.
     * @param id - the taxon id
     * @returns Observable of response from api casted as `Taxon`
     * will be the found taxon
     * @returns `of(null)` if api errors or not found
     * @see Taxon
     */
    async findByTIDWithSynonyms(id: number): Promise<Taxon> {
        return this.taxonRepo.findOne({
            relations: ["acceptedTaxonStatuses", "acceptedTaxonStatuses.parentTaxon"],
            where: {id: id}
        })
    }

    /**
     * Find a taxon using a taxon ID.
     * @param id - the taxon id
     * @returns Observable of response from api casted as `Taxon`
     * will be the found taxon
     * @returns `of(null)` if api errors or not found
     * @see Taxon
     */
    async findByTID(id: number): Promise<Taxon> {
        return this.taxonRepo.findOne({ where: {id: id} })
    }

    /**
     * Create a taxon record using a Partial Taxon record
     * @param data The data for the record to create
     * @return number The created data or null (not found)
     */
    async create(data: Partial<Taxon>): Promise<Taxon> {
        const taxon = this.taxonRepo.create(data);
        return this.taxonRepo.save(taxon);
    }

    /**
     * Update a taxon record using a taxon id.
     * @param id The id of the taxon
     * @param data The data to update
     * @return Taxon The updated data or null (not found or api error)
     */
    async updateByID(id: number, data: Partial<Taxon>): Promise<Taxon> {
        const updateResult = await this.taxonRepo.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

    /**
     * @param kingdomName The kingdom that the taxon belongs to
     * @param rankName The name of the taxon's rank
     * @param scientificName The scientificName for the taxon
     * @return number The taxonID if it exists, otherwise -1
     */
    async taxonExists(kingdomName: string, rankName: string, scientificName: string): Promise<number> {
        const taxonRank = await this.rankRepo.findOne({ kingdomName, rankName });

        if (!taxonRank) {
            return -1;
        }

        const taxon = await this.taxonRepo.findOne({
            select: ['id'],
            where: {
                scientificName,
                rankID: taxonRank.rankID
            }
        });
        return taxon ? taxon.id : -1;
    }

    async fromDwcA(filename: string): Promise<void> {
        let taxonBuffer = [];
        const kingdomNameDwcUri = getDwcField(Taxon, 'kingdom');
        const sciNameDwcUri = getDwcField(Taxon, 'scientificName');
        const rankNameDwcUri = getDwcField(Taxon, 'rankName');
        const authorDwcUri = getDwcField(Taxon, 'author');

        for await (const csvTaxon of DwCArchiveParser.read(filename, Taxon.DWC_TYPE)) {
            if (taxonBuffer.length > TaxonService.UPLOAD_CHUNK_SIZE) {
                await this.taxonRepo.save(taxonBuffer);
                taxonBuffer = [];
            }

            let author = csvTaxon[authorDwcUri];
            const kingdomName = csvTaxon[kingdomNameDwcUri];
            const rankName = csvTaxon[rankNameDwcUri];
            let sciName = csvTaxon[sciNameDwcUri];

            // Clean authorship out of sciName
            if (author) {
                // Thanks to
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                // For the replace regex
                const authorRegexpClean = author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const authorRegexp = new RegExp(`\\s*(${authorRegexpClean})\\s*`)
                sciName = sciName.replace(authorRegexp, '');
            }

            if (!kingdomName) {
                TaxonService.LOGGER.warn(`Taxon does not have a kingdom! Skipping...`);
                continue;
            }
            if (!rankName) {
                TaxonService.LOGGER.warn(`Taxon does not have a rankName! Skipping...`);
                continue;
            }
            if (!sciName) {
                TaxonService.LOGGER.warn(`Taxon does not have a scientificName! Skipping...`);
                continue;
            }

            const taxon = this.taxonRepo.create();
            taxon.scientificName = sciName;
            taxon.author = author;

            // Avoid duplicate uploads
            const taxonID = await this.taxonExists(kingdomName, rankName, sciName);
            if (taxonID !== -1) {
                taxon.id = taxonID;
            }

            // Since we've already manipulated these we don't want to overwrite
            // them
            const setFields = [
                getDwcField(Taxon, 'id'),
                sciNameDwcUri,
                authorDwcUri
            ];

            let extraTaxonFields = this.taxonRepo.manager.connection
                .getMetadata(Taxon)
                .columns
                .map((c) => c.propertyName);

            const csvFields = Object.keys(csvTaxon);

            for (const field of extraTaxonFields) {
                const dwcFieldUri = getDwcField(Taxon, field);
                const isAlreadySet = setFields.includes(dwcFieldUri);

                if (isAlreadySet) {
                    continue;
                }

                if (dwcFieldUri && csvFields.includes(dwcFieldUri)) {
                    taxon[field] = csvTaxon[dwcFieldUri];
                    setFields.push(dwcFieldUri);
                }
            }

            // Store any fields we don't support in dynamic properties
            taxon.dynamicProperties = csvFields.filter((f) => {
                return !setFields.includes(f);
            }).reduce((props, f) => {
                props[f] = csvTaxon[f];
                return props;
            }, { ...taxon.dynamicProperties });

            taxonBuffer.push(taxon);
        }

        await this.taxonRepo.save(taxonBuffer);
    }
}
