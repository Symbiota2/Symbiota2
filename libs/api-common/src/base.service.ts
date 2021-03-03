import { Repository } from 'typeorm';

export abstract class BaseService<T> {
    protected constructor(private readonly repo: Repository<T>) { }

    async findByID(id: number): Promise<T> {
        return this.repo.findOne(id);
    }

    async deleteByID(id: number): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected > 0;
    }
}
