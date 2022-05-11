/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "@symbiota2/ui-common";
import { filter } from "rxjs/operators";
import { ChecklistList } from "../../dto/checklist-list";
import { ChecklistService } from "../../services/checklist/checklist.service";

@Component({
    selector: 'checklist-display-taxa',
    templateUrl: './checklist-taxa.html',
    styleUrls: ['./checklist-taxa.component.scss'],
})
export class ChecklistDisplayTaxaComponent implements OnInit {

    checklist: ChecklistList;
    upload_taxon_access = false;
    upload_taxon_link_access = false;
    user;
    currentUser$ = this.userService.currentUser;
    userID: number = null;
    userCanEdit = false;
    showmore = false;
    showmorelink = 'Show more'

    constructor(
        private userService: UserService,
        private checklistService: ChecklistService,
        private route: ActivatedRoute,
    ) {}

    // private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    // showUploadTaxon() {
    //     this.upload_taxon_access = !this.upload_taxon_access;
    // }

    openDialog(value: string) {
        if (value === 'uploadTaxon') {
            if (this.userCanEdit) this.upload_taxon_access = !this.upload_taxon_access
        }
    }

    // ngOnInit(): void {
    //     //Check if user exist
    //     this.currentUser$.subscribe(loggedIn => {
    //         this.user = loggedIn;
    //         if (this.user) {
    //             this.upload_taxon_link_access = true;
    //         }
    //     })
    // }

    ngOnInit() {
        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid;
                this.userCanEdit = user.canEditChecklist(user.uid);
                // console.log('canedit', this.userCanEdit)
                if (this.userCanEdit) this.upload_taxon_link_access = true;
            });

        this.loadChecklist(parseInt(this.route.params['_value'].projectId), parseInt(this.route.params['_value'].checklistId))

    }

    loadChecklist(pid, clid): void {
        this.checklistService.findAllChecklists(pid).subscribe(
            (chks) => {
                this.checklist = chks.find(checklist => checklist.id === clid);
            }
        )
    }

}
