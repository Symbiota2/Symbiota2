import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockService, TaxonDescriptionStatementService,
    TaxonomicEnumTreeService, TaxonomicStatusService,
    TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '../../services';
import { ApiTaxonSearchCriterion } from '@symbiota2/data-access';
import {
    TaxonTaxonDialogComponent,
} from '../../components/taxon-taxon-dialog/taxon-taxon-dialog.component';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { TaxonListItem } from '../../dto/taxon-list-item';
import { TaxonInputDto } from '../../dto/taxonInputDto';
import { TAXON_EDITOR_ROUTE_PREFIX } from '../../routes';
import { ImageService, ImageTagService } from '@symbiota2/ui-plugin-image'
import {
    OccurrenceSearchResults,
} from '../../../../../ui-plugin-occurrence/src/lib/services/occurrence-search-result.service';
import { OccurrenceService } from '../../../../../ui-plugin-occurrence/src/lib/services/occurrence.service';
import { TaxonDescriptionStatementListItem } from '../../dto';

@Component({
    selector: 'taxon-delete-editor',
    templateUrl: './taxon-delete-editor.html',
    styleUrls: ['./taxon-delete-editor.component.scss'],
})

export class TaxonDeleteEditorComponent implements OnInit {
    private taxonID: string
    private taxonomicAuthorityID = 1 // Set by controller
    userID : number = null
    userCanEdit: boolean = false
    children = []
    editorRoute = TAXON_EDITOR_ROUTE_PREFIX

    prepared: boolean = false

    imageIdsToDelete = []
    imageTagIdsToDelete = []
    occurrenceIdsToDelete = []
    blockIdsToDelete = []
    statusesToDelete = []
    descriptionIdsToDelete = []
    commonNameIdsToDelete = []

    constructor(
        private readonly userService: UserService,
        private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxonStatementService: TaxonDescriptionStatementService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly occurrenceService: OccurrenceService,
        private readonly occurrenceSearchResultService: OccurrenceSearchResults,
        private readonly imageService: ImageService,
        private readonly imageTagService: ImageTagService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            // Find out if this taxon has any children
            this.taxonomicStatusService.findChildren(+this.taxonID, this.taxonomicAuthorityID).subscribe((children) => {
                this.children = children
                //children.forEach((child) => {
//
                //})
            })
        })

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    /*
    openDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(TaxonTaxonDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(TaxonTaxonDialogComponent, {
                width: '80%',
                data: obj
            })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update') {
                this.deleteTaxon()
            }
        })
    }
     */

    // The taxon has been prepared to delete, go ahead and delete it
    deleteTaxon() {
        if (!this.prepared) {
            return
        }
        this.prepared = false

        // Delete the image related records
        // [TODO, should we delete the actual images?]
        // Do the deletes
        this.imageTagIdsToDelete.forEach((id) => {
            this.imageTagService.delete(id).subscribe((result) => {
            })
        })
        this.imageIdsToDelete.forEach((id) => {
            this.imageService.delete(id).subscribe((result) => {
            })
        })

        // Delete occurrences
        this.occurrenceIdsToDelete.forEach((occurrence) => {
            this.occurrenceService.delete(occurrence.id).subscribe((result) => {

            })
        })

        // Next delete the taxon stuff
        // Delete the description block

        this.descriptionIdsToDelete.forEach((statement) => {
            this.taxonStatementService.delete(statement).subscribe((result) => {
            })
        })
        this.blockIdsToDelete.forEach((block) => {
            this.taxonBlockService.delete(block).subscribe((result) => {
            })
        })

        // Delete the vernacular
        this.commonNameIdsToDelete.forEach((common) => {
                this.taxonVernacularService.delete(common).subscribe((result) => {

                })
            })

        // Delete the statuses
        this.statusesToDelete.forEach((status) => {
            this.taxonomicStatusService.delete(status.taxonID, status.taxonAuthorityID, status.taxonIDAccepted).subscribe((result) => {

            })
        })

        // Delete taxa enum tree
        this.taxonomicEnumTreeService.deleteByTaxonID(+this.taxonID).subscribe((result) => {

        })

        // Delete the taxa
        this.taxaService.delete(this.taxonID).subscribe((result) => {

        })

    }

    // Compute the things to delete when the delete is actually invoked
    prepareToDeleteTaxon() {

        // initialize
        this.imageIdsToDelete = []
        this.imageTagIdsToDelete = []
        this.occurrenceIdsToDelete = []
        this.blockIdsToDelete = []
        this.statusesToDelete = []
        this.descriptionIdsToDelete = []
        this.commonNameIdsToDelete = []

        // Find images to delete
        this.imageService.findByTaxonIDs([+this.taxonID]).subscribe((images) => {
            images.forEach((image) => {
                this.imageIdsToDelete.push(image.id)
            })
            if (this.imageIdsToDelete.length > 0) {
                this.imageTagService.findAll({imageIDs: this.imageIdsToDelete}).subscribe((tags) => {
                    tags.forEach((tag) => {
                        this.imageTagIdsToDelete.push(tag.id)
                    })
                })
            }
        })

        // Next find the occurrences
        this.occurrenceSearchResultService.findAll({taxonSearchCriterion: ApiTaxonSearchCriterion.taxonID, taxonSearchStr: this.taxonID}).subscribe((occurrences) => {
            occurrences.data.forEach((occurrence) => {
                this.occurrenceIdsToDelete.push(occurrence.id)
            })
        })

        // Next find the taxon stuff
        // Find the description block
        this.taxonBlockService.findBlocksByTaxonID(+this.taxonID).subscribe((blocks) => {
            blocks.forEach((block) => {
                this.blockIdsToDelete.push(block.id)

                block.descriptionStatements?.forEach((statement) => {
                    this.descriptionIdsToDelete.push(statement.id)
                })

            })
        })

        // Find the vernacular
        this.taxonVernacularService.findByTaxonID(+this.taxonID).subscribe((commons) => {
            commons.forEach((common) => {
                this.commonNameIdsToDelete.push(common.id)
            })
        })

        // Find the statuses
        this.taxonomicStatusService.findAll({taxonomicAuthorityID: null, taxonIDs: [+this.taxonID]}).subscribe((statuses) => {
            statuses.forEach((status) => {
                this.statusesToDelete.push(status)
            })
        })

        this.prepared = true
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
