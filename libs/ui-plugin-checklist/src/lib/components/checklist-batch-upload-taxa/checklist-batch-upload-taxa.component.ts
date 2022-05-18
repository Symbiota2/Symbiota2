/* eslint-disable no-var */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLinkWithHref, Router } from "@angular/router";
import { ChecklistList } from "../../dto/checklist-list";
import { ChecklistTaxonLinkDto } from "../../dto/checklist-taxon-link";
import { ChecklistService } from "../../services/checklist/checklist.service";

import {PathLike, readFileSync} from 'fs';
import { UserService } from "@symbiota2/ui-common";
import { filter } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'checklist-batch-upload-taxon',
    templateUrl: './checklist-batch-upload-taxa.html',
    styleUrls: ['./checklist-batch-upload-taxa.component.scss'],
})
export class ChecklistBatchUploadTaxaComponent implements OnInit {
    currentUser$ = this.userService.currentUser;
    userID: number = null;
    userCanEdit = false;

    checklistTaxonForm: FormGroup;
    taxon: string;
    checklistID: number;
    projectID: number;
    successMessage = '';
    hasError = false;
    hasSuccess = false;
    counter = [0, 0]
    file: ChecklistTaxonLinkDto[] = [];
    taxonCount = [
        {
            success: [], 
            count: 0,
        },
        {
            fail: [],
            count: 0,
            emptyName: 0,
            emptyLine: 0,
            addedCount: 0,
            invalidCount: 0,
            errors: []
        }
    ]
    totalUpload = 0;

    checklist: ChecklistList;

    batchUploadTaxonForm: FormGroup;

    constructor(
        private readonly translate: TranslateService,
        private readonly checklistService: ChecklistService,
        private readonly route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {}
    

    ngOnInit() {

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid;
                this.userCanEdit = user.canEditChecklist(user.uid);
            });

        this.batchUploadTaxonForm = new FormGroup({
            file: new FormControl(null, [Validators.required]),
            taxonomicResolution: new FormControl(null)
        })

        this.projectID = parseInt(this.route.params['_value'].projectId)
        this.checklistID = parseInt(this.route.params['_value'].checklistId)

        this.loadChecklist(this.projectID, this.checklistID)
    }

    loadChecklist(pid, clid): void {
        this.checklistService.findAllChecklists(pid).subscribe(
            (chks) => {
                this.checklist = chks.find(checklist => checklist.id === clid);
            }
        )
    }

    onSelect(e) {
        this.file = e.target.files[0];
    }

    onUpload() {
        this.uploadedDocument(this.file)
    }

    async uploadedDocument(file) {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          file = String(fileReader.result).split('\r\n')
          var counterS = file.length - 1;
          var counterF = file.length -1;
          for (const [i, row] of file.entries()) {

            // index: 0  row: taxon, family override, habitat, abundance, notes, internal notes, source
              const rawFields = row.split(',')
              const fields = rawFields.map((field: string) => field.trim())
              console.log('fields: ', fields)
              if (i > 0) {
                  if (fields.length === 1 && fields[0] === ''){
                    this.taxonCount[1].fail.push('?');
                    this.taxonCount[1].emptyLine++;
                    this.taxonCount[1].errors.push('Empty Line')
                  }
                  else if (fields[0] === '' && fields.length > 1) {
                      //this.taxonCount[0].success.push(taxon.scientificName)
                      this.taxonCount[1].fail.push('? name');
                      this.taxonCount[1].emptyName++;
                      this.taxonCount[1].errors.push('Name cannot be empty.')
      
                  } else {
                    const data = {
                        scientificName: fields[0],                                                                       
                        familyOverride: fields[1], 
                        habitat: fields[2], 
                        abundance: fields[3], 
                        notes: fields[4], 
                        internalNotes: fields[5], 
                        source: fields[6]
                        }
                        
                        this.addTaxonToChecklist(this.projectID, this.checklistID, data)
                        counterS - 1;
                    }
                    
                }
                // console.log('fails', this.taxonCount[1].fail.length)
                //if (this.hasSuccess) counterF - 1;
                //if (this.hasError) counterS - 1;
                // counterS - this.taxonCount[1].fail.length;
                // counterF - this.taxonCount[0].success.length;
          }
        //   console.log('success count: ',counterS);
        //   console.log('fail count: ', counterF)
        // const data: ChecklistTaxonLinkDto[] = [];
        // Object.assign(data, this.file)
        //         this.addTaxonToChecklist(this.projectID, this.checklistID, data)
        }

            // console.log(this.taxonCount[0].count,' names successfully uploaded');
            // console.log('success items: ', this.taxonCount[0].success);
            // console.log('--------------------------------------')
            // console.log(this.taxonCount[1].count + ' names failed');
            // console.log('details: ', this.taxonCount[1])
            // console.log('fail items: ', this.taxonCount[1].fail);
            // console.log('fail items count:::', this.taxonCount[1].fail.length)

        fileReader.readAsText(file);

    }

    addTaxonToChecklist(pid: number, clid: number, taxon: Partial<ChecklistTaxonLinkDto>) {
        this.checklistService.uploadTaxonToChecklist(pid, clid, taxon).subscribe(() => {
            this.successMessage = 'Name successfully uploaded.';
            // console.log('success: ',this.successMessage)
            
            this.taxonCount[0].success.push(taxon.scientificName)
            ++this.taxonCount[0].count;
            this.counter[0] += this.taxonCount[0].count

            //this.totalUpload = this.taxonCount[1].count + this.taxonCount[1].emptyName + this.taxonCount[1].emptyLine;
            
            this.hasSuccess = true;
            // setTimeout(() => {
            //     this.hasSuccess = false;
            //     this.checklistTaxonForm.reset()
            // },15000)
            
        }, (error) => {
            // console.log('error: ', this.errorMessage)
            //console.log('detail: ', pid, clid, taxon.name)
            this.hasError = true;
            this.taxonCount[1].fail.push(taxon.scientificName);
            this.taxonCount[1].count++;
            console.log('num',this.taxonCount[1].count)
            this.taxonCount[1].errors.push(error?.error?.message)

            if (error?.error.message.includes('Name already in the list')) {
                this.taxonCount[1].addedCount++;
            }
            if (error?.error.message.includes('Name not found. It needs to be added to the database.')) {
                this.taxonCount[1].invalidCount++;
            }

            this.totalUpload = this.taxonCount[1].count + this.taxonCount[1].emptyName + this.taxonCount[1].emptyLine;
                
            });
            // setTimeout(() => {
            //     this.hasError = false;
            //     this.checklistTaxonForm.reset()
            // },15000)

    }
}