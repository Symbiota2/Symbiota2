import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KnowledgeGraphService } from '../../services';
import { filter } from 'rxjs/operators';
import { AlertService, ApiClientService, UserService } from '@symbiota2/ui-common';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { KNOWLEDGE_GRAPH_API_BASE } from '../../routes';

export interface ImageInfo {
    id: number
    taxonID: number | null
    url: string
    thumbnailUrl: string
    originalUrl: string
    archiveUrl: string
    photographerName: string
    photographerUID: number | null
    type: string
    format: string
    caption: string
    owner: string
    sourceUrl: string
    referenceUrl: string
    copyright: string
    rights: string
    accessRights: string
    locality: string
    occurrenceID: number | null
    notes: string
    anatomy: string
    username: string
    sourceIdentifier: string
    mediaMD5: string
    dynamicProperties: string
    sortSequence: number
    initialTimestamp: Date
}

@Component({
    selector: 'knowledge-graph-list',
    templateUrl: './knowledge-graph-list-page.html',
    styleUrls: ['./knowledge-graph-list-page.scss'],
})

export class KnowledgeGraphListPage implements OnInit {
    imageID: string

    userID : number = null
    userCanEdit: boolean = false

    imageAPIUrl = null

    constructor(
        private readonly userService: UserService,
        private readonly knowledgeGraphService: KnowledgeGraphService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private readonly translate: TranslateService,
        public dialog: MatDialog,
        private readonly apiClient: ApiClientService,
        private currentRoute: ActivatedRoute
    ) { }

    /*
    Called when Angular starts
    */
    ngOnInit() {
        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditProject(user.uid)
            })
    }


    /*
    Internal routine to encapsulate the show error message at the bottom in case something goes awry
    */
    private showError(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showError(r)
        })
    }

    /*
    Internal routine to encapsulate the show message at the bottom to confirm things actually happened
    */
    private showMessage(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showMessage(r)
        })
    }

}
