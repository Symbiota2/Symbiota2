import { Inject, Injectable } from '@nestjs/common';
import { AdminLanguage } from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';

@Injectable()
export class LanguageService extends BaseService<AdminLanguage> {
    constructor(
        @Inject(AdminLanguage.PROVIDER_ID)
        private readonly languageRepo: Repository<AdminLanguage>) {

        super(languageRepo);
    }

    async findAll(): Promise<AdminLanguage[]> {
        return this.languageRepo.find();
    }
}
