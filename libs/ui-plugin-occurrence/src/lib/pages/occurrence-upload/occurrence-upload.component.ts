import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { OccurrenceService } from '../../services/occurrence.service';
import { AlertService } from '@symbiota2/ui-common';

@Component({
    selector: 'symbiota2-upload',
    templateUrl: './occurrence-upload.component.html',
    styleUrls: ['./occurrence-upload.component.scss']
})
export class OccurrenceUploadComponent implements OnInit {
    private collectionID: number = null;
    public fileInput = new FormControl(null);

    constructor(
        private readonly alerts: AlertService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly occurrences: OccurrenceService) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap;
        if (qParams.has('collectionID')) {
            this.collectionID = parseInt(qParams.get('collectionID'));
        }
        else {
            this.router.navigate(['/']);
        }
    }

    onFileValueChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files.length > 0) {
            this.fileInput.patchValue(target.files[0]);
        }
    }

    onUpload() {
        this.occurrences.postCsv(this.collectionID, this.fileInput.value).subscribe((success) => {
            if (success) {
                this.alerts.showMessage('Upload complete');
            }
            else {
                this.alerts.showError('Upload failed');
            }
        });
    }
}
