import { Injectable } from '@angular/core';
import { Institution} from "@symbiota2/api-database";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiClientService, AlertService, UserService } from "@symbiota2/ui-common";
import { map } from "rxjs/operators";

interface FindAllParams {
    id?: number | number[];
    limit?: number;
    orderBy?: string;
}

@Injectable()
export class InstitutionService {
    private readonly INSTITUTION_BASE_URL = `${this.api.apiRoot()}/institutions`

    constructor(private readonly api: ApiClientService,
        private readonly users: UserService,
        private readonly alerts: AlertService) {}

    getInstitutions(findAllParams?: FindAllParams): Observable<Institution[]>{
        const url = this.api.queryBuilder(this.INSTITUTION_BASE_URL).get();

        return this.api.send(url.build()).pipe(
            map((institutions: Institution[]) => {
                return institutions;
            })
        )
    }

}