import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KnowledgeGraphService } from '../../services';
import { filter } from 'rxjs/operators';
import { AlertService, ApiClientService, UserService } from '@symbiota2/ui-common';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { KnowledgeGraphListItem } from '../../dto';
import { EditableTextDialogComponent } from '@symbiota2/ui-plugin-i18n';
import { DeleteGraphDialogComponent } from '../../components/delete-graph-dialog/delete-graph-dialog.component';
import { BuildGraphDialogComponent, DownloadGraphDialogComponent, RebuildGraphDialogComponent } from '../../components';

@Component({
    selector: 'knowledge-graph-list',
    templateUrl: './knowledge-graph-list-page.html',
    styleUrls: ['./knowledge-graph-list-page.scss'],
})

export class KnowledgeGraphListPage implements OnInit {
    userID : number = null
    userCanEdit: boolean = false
    graphs : KnowledgeGraphListItem[] = []
    graphsToBuild : KnowledgeGraphListItem[] = []

    constructor(
        private readonly userService: UserService,
        private readonly knowledgeGraphService: KnowledgeGraphService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private readonly translate: TranslateService,
        public dialog: MatDialog
    ) {
    }

    /*
    Called when Angular starts
    */
    ngOnInit() {
        this.knowledgeGraphService.list().subscribe((g) => {
            g.forEach((graph) => {
                if (graph.updatedAt == null) {
                    this.graphsToBuild.push(graph)
                } else {
                    this.graphs.push(graph)
                }
            })
        })
        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditProject(user.uid)
            })
    }

    doDownload(name) {
        const dialogRef = this.dialog.open(DownloadGraphDialogComponent, {
            width: '90%',
            data: name,

        })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event != 'zzzCancel') {
                console.log("downloading the graph " + name)
            }
        })
    }

    doDelete(name) {
        const dialogRef = this.dialog.open(DeleteGraphDialogComponent, {
            width: '90%',
            data: name,

        })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event != 'zzzCancel') {
                console.log("deleting the graph " + name)
            }
        })
    }

    doBuild(name) {
        const dialogRef = this.dialog.open(BuildGraphDialogComponent, {
            width: '90%',
            data: name,

        })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event != 'zzzCancel') {
                console.log("building the graph " + name)
            }
        })
    }

    doRebuild(name) {
        const dialogRef = this.dialog.open(RebuildGraphDialogComponent, {
            width: '90%',
            data: name,

        })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event != 'zzzCancel') {
                console.log("rebuilding the graph " + name)
            }
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
