import { Injectable } from '@angular/core';
import { OccurrenceQueryBuilder } from './occurrence-query-builder';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Occurrence, OccurrenceListItem } from '../dto';

interface FindAllParams {
    collectionIDs: number[];
    catalogNumber?: string;

    limit?: number;
    offset?: number;
}

@Injectable()
export class OccurrenceService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    findAll(params: FindAllParams): Observable<OccurrenceListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .collectionIDs(params.collectionIDs)
            .catalogNumber(params.catalogNumber)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((occurrences) => occurrences.map((o) => {
                    return OccurrenceListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<Occurrence> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => Occurrence.fromJSON(o)));
    }

    // postCsv(csv: File): Observable<void> {
    //     const url = this.createQueryBuilder()
    // }

    private createQueryBuilder(): OccurrenceQueryBuilder {
        return new OccurrenceQueryBuilder(this.appConfig.apiUri());
    }
}
