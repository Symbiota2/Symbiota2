import { Repository } from 'typeorm';

/**
 * Abstract service that provides generic findByID() and deleteByID()
 * implementations
 */
export abstract class BaseService<T> {
    protected constructor(private readonly repo: Repository<T>) { }

    /**
     * @param id The database ID of the resource
     * @return T The requested resource, or null if none can be found
     */
    async findByID(id: number): Promise<T | null> {
        const resource = await this.repo.findOne(id);
        if (resource === undefined) {
            return null;
        }
        return resource;
    }

    /**
     * @param id The database ID of the resource
     * @return boolean Whether the resource was found and deleted
     */
    async deleteByID(id: number): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected > 0;
    }
}
