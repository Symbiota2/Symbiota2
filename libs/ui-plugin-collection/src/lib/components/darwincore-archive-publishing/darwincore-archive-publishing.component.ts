import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '@symbiota2/ui-common';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { Observable } from 'rxjs';
import { PublishedCollection } from '../../dto/DwCCollection.dto';
import { DarwinCoreArchiveService } from '../../services/darwin-core-archive.service';

@Component({
    selector: 'symbiota2-darwincore-archive-publishing',
    templateUrl: './darwincore-archive-publishing.component.html',
    styleUrls: ['./darwincore-archive-publishing.component.scss'],
})
export class DarwinCoreArchivePublishingComponent implements OnInit {
    collection$: Observable<Collection>;
    publishedCollection$: Observable<PublishedCollection>;

    publishArchiveForm: FormGroup = this.fb.group(
      {
        includeImageURLs: [false, Validators.required],
        redactSensitiveLocalities: [false, Validators.required]
      }
    )

    constructor(
        private readonly collectionService: CollectionService,
        private readonly dwcService: DarwinCoreArchiveService,
        private readonly fb: FormBuilder,
        private dialog: MatDialog,
        private readonly alerts: AlertService,
    ) {}

    ngOnInit(): void {
        this.collection$ = this.collectionService.currentCollection;
        this.publishedCollection$ = this.dwcService.getCurrentCollectionArchive();
    }
    

    onPublishArchive(): void{
      //TODO: when Evin implements imageURLs and RedactSensitiveLocalities Flags add them to function
      this.alerts.showMessage("hey ho i work ;)");
    }
}
