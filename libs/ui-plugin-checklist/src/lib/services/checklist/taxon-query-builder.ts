import {
    Q_PARAM_TAXAIDS,
    Q_PARAM_AUTHORITYID,
    Q_PARAM_PARTIALNAME,
    Q_PARAM_SCIENTIFICNAME,
    Q_PARAM_WITHIMAGES, Q_PARAM_KINGDOMNAME, Q_PARAM_RANKID, Q_PARAM_LIMIT
} from '../../../constants';

export class TaxonQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL
    _authorityID: string
    _partialName: string

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/projects`)
    }

    // findAllScientificNames() : FindAllScientificNamesBuilder {
    //     return new FindAllScientificNamesBuilder(this.baseUrl)
    // }

    findAllProjects(): FindAllProjectsBuilder {
        return new FindAllProjectsBuilder(this.baseUrl);
    }

    findAllChecklists(): FindAllChecklistsBuilder {
        return new FindAllChecklistsBuilder(this.baseUrl);
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    findOneWithSynonyms(): FindOneWithSynonymsBuilder {
        return new FindOneWithSynonymsBuilder(this.baseUrl)
    }

    problemUploadRows(): ProblemUploadRowsBuilder {
        return new ProblemUploadRowsBuilder(this.baseUrl)
    }

    problemAcceptedNames(): ProblemAcceptedNamesBuilder {
        return new ProblemAcceptedNamesBuilder(this.baseUrl)
    }

    problemParentNames(): ProblemParentNamesBuilder {
        return new ProblemParentNamesBuilder(this.baseUrl)
    }

    problemRanks(): ProblemRanksBuilder {
        return new ProblemRanksBuilder(this.baseUrl)
    }

    create(): CreateOneBuilder {
        return new CreateOneBuilder(this.baseUrl);
    }

    delete(): DeleteOneBuilder {
        return new DeleteOneBuilder(this.baseUrl);
    }

    upload(): UploadBuilder {
        return new UploadBuilder(this.baseUrl);
    }

    uploadChecklistTaxon(): UploadChecklistTaxonBuilder {
        return new UploadChecklistTaxonBuilder(this.baseUrl)
    }

    uploadFile(): UploadFileBuilder {
        return new UploadFileBuilder(this.baseUrl);
    }

    build(): string {

        return this.url.toString()
    }
}

////////////////////////////////////////////////////////////////////////////

class CreateOneBuilder extends TaxonQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class DeleteOneBuilder extends TaxonQueryBuilder {
    protected _id: number;

    id(id: number): DeleteOneBuilder {
        this._id = id
        return this;
    }

    build(): string {
        if (this._id) {
            this.url.pathname += `/${this._id}`
        }
        return super.build()
    }
}

class ProblemAcceptedNamesBuilder extends TaxonQueryBuilder {
    build(): string {
        this.url.pathname = `${this.url.pathname}/upload/results/2`;
        return super.build();
    }
}

class ProblemUploadRowsBuilder extends TaxonQueryBuilder {
    build(): string {
        this.url.pathname = `${this.url.pathname}/upload/results/1`;
        return super.build();
    }
}

class ProblemParentNamesBuilder extends TaxonQueryBuilder {
    build(): string {
        this.url.pathname = `${this.url.pathname}/upload/results/3`;
        return super.build();
    }
}

class ProblemRanksBuilder extends TaxonQueryBuilder {
    build(): string {
        this.url.pathname = `${this.url.pathname}/upload/results/4`;
        return super.build();
    }
}

class UploadFileBuilder extends TaxonQueryBuilder {
    private _id: number = null;
    private _authID: number = null

    id(id: number): UploadFileBuilder {
        this._id = id;
        return this;
    }

    authorityID(id: number): UploadFileBuilder {
        this._authID = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/upload`;
        if (this._id) {
            this.url.pathname += `/${this._id}`;
        }
        if (this._authID) {
            this.url.pathname += `/${this._authID}`;
        }
        return super.build();
    }
}

class UploadBuilder extends TaxonQueryBuilder {
    private _id: number = null;
    private _authID: number = null

    id(id: number): UploadBuilder {
        this._id = id;
        return this;
    }

    authorityID(id: number): UploadBuilder {
        this._authID = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}`;
        if (this._id) {
            this.url.pathname += `/${this._id}`;
        }
        if (this._authID) {
            this.url.pathname += `/${this._authID}`;
        }
        return super.build();
    }
}

class FindOneBuilder extends TaxonQueryBuilder {
    protected projectId: number = null

    id(id: number): FindOneBuilder {
        this.projectId = id
        return this
    }

    authorityID(authorityID? : string): FindOneBuilder {
        this._authorityID = authorityID? authorityID : undefined
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.projectId}`
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        return super.build()
    }
}

class FindOneWithSynonymsBuilder extends TaxonQueryBuilder {
    protected taxonID: number = null

    id(id: number): FindOneWithSynonymsBuilder {
        this.taxonID = id
        return this
    }


    authorityID(authorityID? : string): FindOneWithSynonymsBuilder {
        this._authorityID = authorityID? authorityID : undefined
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/withSynonyms/${this.taxonID}`
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        return super.build()
    }
}

class FindAllProjectsBuilder extends TaxonQueryBuilder {
    _name: string;
    _managers: string;
    _briefDescription: string;
    _limit: string;

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl);
        this.baseUrl = apiBaseUrl;
        this.url = new URL(`${apiBaseUrl}/projects`)
    }

    build(): string {
        return super.build();
    }
}

class UploadChecklistTaxonBuilder extends TaxonQueryBuilder {
    projectId: number;
    checklistId: number;

    id(pid: number, clid: number)  {
        this.projectId = pid;
        this.checklistId = clid;

        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.projectId}/checklists/${this.checklistId}/taxon`;
        return super.build();
    }
}

class FindAllChecklistsBuilder extends TaxonQueryBuilder {
    projectId: number;
    _name: string;
    _title: string;
    _locality: string;
    _abstract: string;
    _limit: string;

    id(id: number): FindAllChecklistsBuilder {
        this.projectId = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.projectId}/checklists`;
        return super.build();
    }
}

// class FindAllScientificNamesBuilder extends TaxonQueryBuilder {
//     _withImages = false
//     _rankID : string
//     _kingdomName : string
//     _limit : string

//     constructor(apiBaseUrl: string) {
//         super(apiBaseUrl)
//         this.baseUrl = apiBaseUrl
//         this.url = new URL(`${apiBaseUrl}/projects`)
//     }

//     limit(number): FindAllScientificNamesBuilder {
//         this._limit = number
//         return this
//     }
//     authorityID(authorityID : string): FindAllScientificNamesBuilder {
//         this._authorityID = authorityID
//         return this
//     }

//     rankID(rankID : string): FindAllScientificNamesBuilder {
//         this._rankID = rankID
//         return this
//     }

//     partialName(name : string): FindAllScientificNamesBuilder {
//         this._partialName = name
//         return this
//     }

//     kingdomName(name : string): FindAllScientificNamesBuilder {
//         this._kingdomName = name
//         return this
//     }

//     withImages(): FindAllScientificNamesBuilder {
//         this._withImages = true
//         //this.url = new URL(`${this.baseUrl}/taxon/speciesNames`)
//         return this
//     }

//     build(): string {
//         if (this._limit) {
//             this.url.searchParams.append(Q_PARAM_LIMIT, this._limit)
//         }
//         if (this._authorityID) {
//             this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
//         }
//         if (this._rankID) {
//             this.url.searchParams.append(Q_PARAM_RANKID, this._rankID)
//         }
//         if (this._partialName) {
//             this.url.searchParams.append(Q_PARAM_PARTIALNAME, this._partialName)
//         }
//         if (this._kingdomName) {
//             this.url.searchParams.append(Q_PARAM_KINGDOMNAME, this._kingdomName)
//         }
//         if (this._withImages) {
//             this.url.searchParams.append(Q_PARAM_WITHIMAGES, "yes")
//         }
//         return super.build()
//     }
// }

class FindAllBuilder extends TaxonQueryBuilder {
    protected _taxonIDs: number[] = [];
    protected _scientificName: string = null

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    authorityID(authorityID? : string): FindAllBuilder {
        this._authorityID = authorityID? authorityID : undefined
        return this
    }

    scientificName(sciName: string): FindAllBuilder {
        this._scientificName = sciName
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        if (this._scientificName) {
            this.url.searchParams.append(Q_PARAM_SCIENTIFICNAME, this._scientificName)
        }
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}
