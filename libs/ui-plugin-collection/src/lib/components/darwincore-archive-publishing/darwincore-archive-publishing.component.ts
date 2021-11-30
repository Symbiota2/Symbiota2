import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '@symbiota2/ui-common';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeAll, switchMap, take } from 'rxjs/operators';
import {
    CollectionArchive,
    PublishedCollection,
} from '../../dto/DwcCollection.dto';
import { DarwinCoreArchiveService } from '../../services/darwin-core-archive.service';

@Component({
    selector: 'symbiota2-darwincore-archive-publishing',
    templateUrl: './darwincore-archive-publishing.component.html',
    styleUrls: ['./darwincore-archive-publishing.component.scss'],
})
export class DarwinCoreArchivePublishingComponent implements OnInit {
    collection$: Observable<Collection>;
    archiveInfo$: Observable<CollectionArchive>;

    publishArchiveForm: FormGroup = this.fb.group({
        includeImageURLs: [false, Validators.required],
        redactSensitiveLocalities: [false, Validators.required],
    });

    constructor(
        private readonly collectionService: CollectionService,
        private readonly dwcService: DarwinCoreArchiveService,
        private readonly fb: FormBuilder,
        private dialog: MatDialog,
        private readonly alerts: AlertService
    ) {}

    ngOnInit(): void {
        this.collection$ = this.collectionService.currentCollection;
        this.archiveInfo$ = this.dwcService.getCurrentCollectionArchiveInfo();
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
        });
    }

    onDownloadArchive(): void {
        this.alerts.showMessage('Downloading Archive...');
        combineLatest([this.archiveInfo$, this.collection$]).pipe(
            switchMap(([archive, collection]) => {
                return this.dwcService.downloadCollectionArchive(collection.id).pipe(
                    map((stream) => {
                        var blob = new Blob([stream]);
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.download = archive.archive;
                        link.href = url;
                        link.click();
                        link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    })
                );
            })
        ).subscribe();
    }
}
