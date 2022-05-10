/* eslint-disable @angular-eslint/component-selector */
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChecklistList } from "../../dto/checklist-list";
import { ChecklistProject } from '../../dto/checklist-projects';
import { ChecklistService } from "../../services/checklist/checklist.service";

@Component({
    selector: 'checklist-single-page',
    templateUrl: './checklist-single-page.html',
    styleUrls: ['checklist-single-page.component.scss'],
})
export class ChecklistSinglePageComponent {
    checklistProject: ChecklistProject;
    checklistList: ChecklistList[];
    checklistProjectLinks = []
    constructor(private checklistService: ChecklistService, private route: ActivatedRoute) {
        this.loadProject(parseInt(this.route.params['_value'].projectId))
        this.loadChecklists(parseInt(this.route.params['_value'].projectId));
        //console.log('id---', typeof parseInt(this.route.params['_value'].projectId))
    }

    async loadProject(pid: number) {
        this.checklistService.findByID(pid)
        .subscribe(project => {
            this.checklistProject = project;
            // console.log('checklist: ', project)
        })
    }

    async loadChecklists(pid: number) {
        // console.log('test checklist')
        this.checklistService.findAllChecklists(pid)
        .subscribe(checklists => {
            this.checklistList = checklists
            // console.log('checklist list: ', this.checklistList)
        });
    }
}