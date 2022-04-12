import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@symbiota2/ui-common';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Collection } from '../../dto/Collection.output.dto';
import { DwcArchive } from '../../dto/Dwc.dto';
import { CollectionService } from '../../services/collection/collection.service';
import { DwcService } from '../../services/dwc/dwc.service';

@Component({
    selector: 'symbiota2-dwc-publishing',
    templateUrl: './dwc-publishing.component.html',
    styleUrls: ['./dwc-publishing.component.scss'],
})
export class DwcPublishingComponent implements OnInit {
    collection$: Observable<Collection>;
    archiveInfo$: Observable<DwcArchive>;

    /** To create new Date from date string in archiveInfo.updateAt */
    lastUpdate: Date;

    publishArchiveForm: FormGroup = this.fb.group({
        includeImageURLs: [false, Validators.required],
        redactSensitiveLocalities: [false, Validators.required],
    });

    constructor(
        private readonly collectionService: CollectionService,
        private readonly dwcService: DwcService,
        private readonly fb: FormBuilder,
        private readonly alerts: AlertService
    ) {}

    ngOnInit(): void {
        this.collection$ = this.collectionService.currentCollection;
        this.archiveInfo$ = this.dwcService.getCurrentCollectionArchiveInfo();
        this.archiveInfo$.subscribe((archive)=> {
            this.lastUpdate = new Date(archive.updatedAt);
        }).unsubscribe();
    }

    onPublishArchive(): void {
        this.collection$.subscribe((collection) => {
            this.dwcService
                .createDarwinCoreArchive(collection.id)
                .subscribe((res) => {
                    if (res) {
                        this.alerts.showMessage(
                            `Darwin Core Archive publishing job successfully sent!`
                        );
                    } else {
                        this.alerts.showError(
                            `Something went wrong submitting DwC-Archive publish request`
                        );
                    }
                });
        }).unsubscribe();
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
      
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      
        const i = Math.floor(Math.log(bytes) / Math.log(k));
      
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }

}
