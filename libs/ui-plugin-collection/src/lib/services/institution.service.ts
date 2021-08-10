import { Injectable } from '@angular/core';
import { Institution } from '@symbiota2/api-database';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    ApiClientService,
    AlertService,
    UserService,
} from '@symbiota2/ui-common';
import { map, retry, filter} from 'rxjs/operators';
import { InstitutionInputDto } from '../dto/Institution.input.dto';

interface FindAllParams {
    id?: number | number[];
    limit?: number;
    orderBy?: string;
}

@Injectable()
export class InstitutionService {
    private readonly INSTITUTION_BASE_URL = `${this.api.apiRoot()}/institutions`;

    constructor(
        private readonly api: ApiClientService,
        private readonly users: UserService,
        private readonly alerts: AlertService
    ) {}

    getInstitutions(findAllParams?: FindAllParams): Observable<Institution[]> {
        const url = this.api.queryBuilder(this.INSTITUTION_BASE_URL).get();

        return this.api.send(url.build()).pipe(
            map((institutions: Institution[]) => {
                return institutions;
            })
        );
    }

    isNameTaken(name: string): Observable<boolean> {
        return this.getInstitutions().pipe(map(instList => {
            for(var index = 0; index < instList.length; index++)
            {
                if(instList[index].name === name)
                {
                    return true;
                }
            }
            return false;
        }))
    }

    isCodeTaken(code: string): Observable<boolean> {
        return this.getInstitutions().pipe(map(instList => {
            for(var index = 0; index < instList.length; index++)
            {
                if(instList[index].code === code)
                {
                    return true;
                }
            }
            return false;
        }))
    }

    createInstitution(
        institutionData: Partial<InstitutionInputDto>,
        userToken: string
    ): Observable<Institution> {
        const req = this.api
            .queryBuilder(this.INSTITUTION_BASE_URL)
            .post()
            .body(institutionData)
            .addJwtAuth(userToken)
            .build();

        return this.api.send(req).pipe(
            map((inst: Institution) => {
                if (inst === null){
                    return null;
                }
                return inst;
            })
        )
    }
}
