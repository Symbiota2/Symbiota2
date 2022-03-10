import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicStatusService,
    TaxonomicUnitService,
    TaxonService
} from '../../../../../ui-plugin-taxonomy/src/lib/services';
import {
    TaxonListItem, TaxonomicStatusListItem
} from '../../../../../ui-plugin-taxonomy/src/lib/dto';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { ImageService } from '../../services';
import { ImageDetailsEditorDialogComponent } from '../image-details-editor-dialog/image-details-editor-dialog.component';
import { ImageListItem, ImageInputDto } from '../../dto';

export interface ImageInfo {
    id: number
    taxonID: number | null
    url: string
    thumbnailUrl: string
    originalUrl: string
    archiveUrl: string
    photographerName: string
    photographerUID: number | null
    type: string
    format: string
    caption: string
    owner: string
    sourceUrl: string
    referenceUrl: string
    copyright: string
    rights: string
    accessRights: string
    locality: string
    occurrenceID: number | null
    notes: string
    anatomy: string
    username: string
    sourceIdentifier: string
    mediaMD5: string
    dynamicProperties: string
    sortSequence: number
    initialTimestamp: Date
}

@Component({
    selector: 'image-details-editor',
    templateUrl: './image-details-editor.html',
    styleUrls: ['./image-details-editor.component.scss'],
})

export class ImageDetailsEditorComponent implements OnInit {
    imageID: string
    image: ImageListItem
    taxon: TaxonListItem
    taxonomicStatus: TaxonomicStatusListItem

    dataSource
    private taxonID: string
    private idCounter = 0
    userID : number = null
    userCanEdit: boolean = true
    ranksIDtoName = new Map()
    rankName = ""

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        private readonly imageService: ImageService,
        private readonly taxonStatusService: TaxonomicStatusService,
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

        console.log(" initializing ")
        this.currentRoute.paramMap.subscribe(params => {
            this.imageID = params.get('imageID')
            // Load the profile
            this.loadImage(parseInt(this.imageID))
        })

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditProject(user.uid)
            })
    }

    /*
    Load the image details
    */
    loadImage(imageID: number) {
        console.log(" loading image ")
        this.imageService.findByID(imageID).subscribe((image) => {
            this.image = image
            this.taxonStatusService.findAll({taxonIDs : [this.image.taxonID], taxonomicAuthorityID: 1}).subscribe((taxonomicStatuses) => {
                let authoritySet = false
                taxonomicStatuses.forEach((taxonomicStatus) => {
                    if (!authoritySet) {
                        this.taxonomicStatus = taxonomicStatus
                        this.taxon = taxonomicStatus.taxon
                    }
                    if (taxonomicStatus.taxonID == taxonomicStatus.taxonIDAccepted) {
                        authoritySet = true
                    }
                })
            })
        })
    }

    goToLink(url: string){
        window.open("image/details/editor/" + url, "_blank");
    }

    openDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(ImageDetailsEditorDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(ImageDetailsEditorDialogComponent, {
                width: '80%',
                data: obj
            })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update') {
                this.updateData(result.data)
            }
        })
    }

    updateData(obj) {
        console.log(" updating ")
        // Copy data to current state
        this.image.caption = obj.caption
        this.image.photographerName = obj.photographerName
        this.image.owner = obj.owner
        this.image.originalUrl = obj.originalUrl
        this.image.locality = obj.locality
        this.image.notes = obj.notes
        this.image.copyright = obj.copyright
        this.image.accessRights = obj.accessRights
        this.image.rights = obj.rights

        // Construct a new taxon
        let a = obj as unknown as Record<PropertyKey, unknown>
        a.id = this.taxonID
        a.initialTimestamp = new Date()
        const newImage = new ImageInputDto(a)

        console.log(" image is " + JSON.stringify(newImage))

        this.imageService
            .update(newImage)
            .subscribe((image)=> {
                if (image) {
                    // It has been updated in the database
                    this.showMessage("image.details.editor.updated")
                } else {
                    // Error in adding
                    this.showError("image.details.editor.update.error")
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
