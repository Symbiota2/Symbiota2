/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ChecklistTaxonLinkDto } from "../../dto/checklist-taxon-link";
import { ChecklistService } from "../../services/checklist/checklist.service";

@Component({
    selector: 'checklist-upload-taxon',
    templateUrl: './checklist-upload-taxon.html',
    styleUrls: ['./checklist-upload-taxon.component.scss'],
})
export class ChecklistUploadTaxonComponent implements OnInit {
    checklistTaxonForm: FormGroup;
    taxon: string;
    checklistID: number;
    projectID: number;
    successMessage = '';
    errorMessage = '';
    hasError = false;
    hasSuccess = false;

    constructor(private readonly checklistService: ChecklistService,
                private readonly route: ActivatedRoute) {}

    ngOnInit() {
        this.checklistTaxonForm = new FormGroup({
            scientificName: new FormControl('', [Validators.required]),
            familyOverride: new FormControl(null),
            habitat: new FormControl(null),
            abundance: new FormControl(null),
            notes: new FormControl(null),
            internalNotes: new FormControl(null),
            source: new FormControl(null)
        })

        this.projectID = parseInt(this.route.params['_value'].projectId);
        this.checklistID = parseInt(this.route.params['_value'].checklistId);
    }

    async onAddTaxon(pid: number, clid: number, data: Partial<ChecklistTaxonLinkDto>) {

        this.checklistService.uploadTaxonToChecklist(pid, clid, data).subscribe(() => {
            this.successMessage = 'Name successfully added.';
            this.hasSuccess = true;
            setTimeout(() => {
                this.hasSuccess = false;
                this.checklistTaxonForm.reset()
            },15000)
        }, (error) => {
                this.errorMessage = error.error.message;
                this.hasError = true;
            });
            setTimeout(() => {
                this.hasError = false;
                this.checklistTaxonForm.reset()
            },15000)
    }
}