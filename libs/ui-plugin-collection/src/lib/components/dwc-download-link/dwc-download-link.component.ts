import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from '@symbiota2/ui-common';
import { DwcArchive } from '@symbiota2/ui-plugin-collection';
import { map } from 'rxjs/operators';
import { DwcService } from '../../services/dwc.service';

@Component({
    selector: 'symbiota2-dwc-download-link',
    templateUrl: './dwc-download-link.component.html',
    styleUrls: ['./dwc-download-link.component.scss'],
})
export class DwcDownloadLinkComponent implements OnInit {
    @Input() archive: DwcArchive;

    constructor(
        private readonly dwcService: DwcService,
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
