/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';

import { ChecklistService } from '../../services/checklist/checklist.service';

@Component({
    selector: 'checklist-regional-page',
    templateUrl: './checklist-regional-page.html',
    styleUrls: ['./checklist-regional-page.component.scss'],
})
export class ChecklistRegionalPageComponent {
    checklistProjects = [];

    constructor(
        private readonly userService: UserService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog,
        private checklistService: ChecklistService
    ) {
        this.loadProjects()
    }

    loadProjects() {
        this.checklistService
            .findAllProjects()
            .subscribe((projects) => {
                console.log(projects)
                this.checklistProjects = projects
                console.log('data: ',this.checklistProjects)
            });
    }

}
