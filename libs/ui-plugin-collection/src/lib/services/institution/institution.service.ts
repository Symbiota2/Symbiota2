import { Injectable } from '@angular/core';
import { Institution } from '@symbiota2/api-database';
import {
    ApiClientService,
    AlertService,
    UserService,
} from '@symbiota2/ui-common';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { InstitutionInputDto } from '../../dto/Institution.input.dto';

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
        private readonly userService: UserService,
        private readonly alertService: AlertService
    ) {}

    /**
     * fetches list of institutions from api
     * @param findAllParams optional search parameters for api
     * @returns Observable of Institution list from api. if api error returns null in observable
     */
    getInstitutions(findAllParams?: FindAllParams): Observable<Institution[]> {
        const url = this.api.queryBuilder(this.INSTITUTION_BASE_URL).get();

        return this.api.send(url.build()).pipe(
            map((institutions: Institution[]) => {
                return institutions;
            })
        );
    }

    /**
     * Checks if Institution name is in use
     * @param name string to be checked against db institution's names
     * @returns observable of first boolean
     */
    isNameTaken(name: string): Observable<boolean> {
        return this.getInstitutions().pipe(
            map((instList) => {
                for (var index = 0; index < instList.length; index++) {
                    if (instList[index].name === name) {
                        return true;
                    }
                }
                return false;
            }),
            take(1)
        );
    }

    /**
     * Checks if Institution Code is in use
     * @param code string to be checked against db institution's codes
     * @returns observable of first boolean
     */
    isCodeTaken(code: string): Observable<boolean> {
        return this.getInstitutions().pipe(
            map((instList) => {
                for (var index = 0; index < instList.length; index++) {
                    if (instList[index].code === code) {
                        return true;
                    }
                }
                return false;
            }),
            take(1)
        );
    }

    /**
     * sends a request to api to post new institution. user must be logged in and be a SuperAdmin to post to api.
     * @param institutionData InstitutionInputDto to populate new institution in body of request
     * @returns Observable of response from api casted to an institution. if api error or user permission not met, returns null
     */
    createInstitution(
        institutionData: Partial<InstitutionInputDto>
    ): Observable<Institution> {
        return this.userService.currentUser.pipe(
            switchMap((user) => {
                if (!!user && user.isSuperAdmin()) {
                    const req = this.api
                        .queryBuilder(this.INSTITUTION_BASE_URL)
                        .post()
                        .body(institutionData)
                        .addJwtAuth(user.token)
                        .build();

                    return this.api.send(req).pipe(
                        map((inst: Institution) => {
                            if (inst === null) {
                                return null;
                            }
                            return inst;
                        })
                    );
                } else {
                    this.alertService.showError(
                        'Create Institution: Permission Denied'
                    );
                }
            })
        );
    }
}
