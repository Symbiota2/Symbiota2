import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { CollectionArchive } from '../../dto/DwcCollection.dto';
import { DarwinCoreArchiveService } from '../../services/darwin-core-archive.service';

@Component({
    selector: 'symbiota2-darwincore-archive-download-link',
    templateUrl: './darwincore-archive-download-link.component.html',
    styleUrls: ['./darwincore-archive-download-link.component.scss'],
})
export class DarwincoreArchiveDownloadLinkComponent implements OnInit {
    @Input() archive: CollectionArchive;

    constructor(
        private readonly dwcService: DarwinCoreArchiveService,
        private readonly alerts: AlertService
    ) {}

    ngOnInit(): void {}

    onDownloadArchive(): void {
        this.alerts.showMessage('Downloading Archive...');
        this.dwcService
            .downloadCollectionArchive(this.archive.collectionID)
            .pipe(
                map((stream) => {
                    var blob = new Blob([stream]);
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.download = this.archive.archive;
                    link.href = url;
                    link.click();
                    link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
            )
            .subscribe();
    }
}
