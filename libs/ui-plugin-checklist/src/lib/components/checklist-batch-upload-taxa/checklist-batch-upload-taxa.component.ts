/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ChecklistList } from "../../dto/checklist-list";
import { ChecklistTaxonLinkDto } from "../../dto/checklist-taxon-link";
import { ChecklistService } from "../../services/checklist/checklist.service";

@Component({
    selector: 'checklist-batch-upload-taxon',
    templateUrl: './checklist-batch-upload-taxa.html',
    styleUrls: ['./checklist-batch-upload-taxa.component.scss'],
})
export class ChecklistBatchUploadTaxaComponent implements OnInit {
    checklistTaxonForm: FormGroup;
    taxon: string;
    checklistID: number;
    projectID: number;
    successMessage = '';
    errorMessage = '';
    hasError = false;
    hasSuccess = false;

    checklist: ChecklistList;

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