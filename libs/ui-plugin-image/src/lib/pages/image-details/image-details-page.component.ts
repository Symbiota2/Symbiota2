import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicStatusService,
    TaxonService
} from '../../../../../ui-plugin-taxonomy/src/lib/services';
import {
    TaxonListItem, TaxonomicStatusListItem
} from '../../../../../ui-plugin-taxonomy/src/lib/dto';
import { ImageService } from '../../services';
import { ImageListItem, ImageInputDto } from '../../dto';
import { filter } from 'rxjs/operators';
import { AlertService, ApiClientService, UserService } from '@symbiota2/ui-common';
import { ImageDetailsEditorDialogComponent } from '../../components';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { IMAGE_API_BASE } from '../../routes';


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
    selector: 'image-details',
    templateUrl: './image-details-page.html',
    styleUrls: ['./image-details-page.component.scss'],
})

export class ImageDetailsPageComponent implements OnInit {
    imageID: string
    image: ImageListItem
    taxon: TaxonListItem
    taxonomicStatus: TaxonomicStatusListItem

    userID : number = null
    userCanEdit: boolean = false

    imageAPIUrl = null

    constructor(
        private readonly userService: UserService,
        private readonly taxonService: TaxonService,
        private readonly imageService: ImageService,
        private readonly taxonStatusService: TaxonomicStatusService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private readonly translate: TranslateService,
        public dialog: MatDialog,
        private readonly apiClient: ApiClientService,
        private currentRoute: ActivatedRoute
    ) { }

    /*
    Called when Angular starts
    */
    ngOnInit() {
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
        this.imageService.findByID(imageID).subscribe((image) => {
            this.image = image
            this.taxonService.findByID(this.image.taxonID).subscribe((txn) => {
                this.taxon = txn
            })
        })
     }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
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
        a.id = this.imageID
        a.initialTimestamp = new Date()
        const newImage = new ImageInputDto(a)

        newImage.sortSequence = 50
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

    localize(name) {
        const re = new RegExp('^(?:[a-z]+:)?//', 'i')
        if (re.test(name)) {
            // We have an external url
            return name
        } else {
            if (!this.imageAPIUrl) {
                this.imageAPIUrl = this.apiClient.apiRoot() + "/" + IMAGE_API_BASE  + "/imglib/"
            }
            return this.imageAPIUrl + encodeURIComponent(name)
        }

    }
}
