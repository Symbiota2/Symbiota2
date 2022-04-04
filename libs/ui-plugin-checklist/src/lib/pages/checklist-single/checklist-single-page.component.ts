/* eslint-disable @angular-eslint/component-selector */
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChecklistProject } from '../../dto/checklist-projects';
import { ChecklistService } from "../../services/checklist/checklist.service";

@Component({
    selector: 'checklist-single-page',
    templateUrl: './checklist-single-page.html',
    styleUrls: ['checklist-single-page.component.scss'],
})
export class ChecklistSinglePageComponent {
    checklistProject: ChecklistProject;
    constructor(private checklistService: ChecklistService, private route: ActivatedRoute) {
        //this.onClick();
        this.onClick(this.route.params['_value'].projectId)
    }

    onClick(pid) {
        this.checklistService.findByID(pid)
        .subscribe(project => {
            this.checklistProject = project;
        })
    }
}