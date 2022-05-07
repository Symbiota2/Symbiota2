/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from "@angular/core";
import { UserService } from "@symbiota2/ui-common";
import { filter } from "rxjs/operators";

@Component({
    selector: 'checklist-display-taxa',
    templateUrl: './checklist-taxa.html',
    styleUrls: ['./checklist-taxa.component.scss'],
})
export class ChecklistDisplayTaxaComponent implements OnInit {
    constructor(private userService: UserService) {}
    upload_taxon_access = false;
    upload_taxon_link_access = false;
    user;
    currentUser$ = this.userService.currentUser;
    userID: number = null;
    userCanEdit = false;
    // private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    // showUploadTaxon() {
    //     this.upload_taxon_access = !this.upload_taxon_access;
    // }

    openDialog(value: string) {
        if (value === 'uploadTaxon') {
            this.upload_taxon_access = !this.upload_taxon_access
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
                this.upload_taxon_link_access = true;
            });
    }
}
