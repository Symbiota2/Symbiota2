import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'symbiota2-upload',
    templateUrl: './occurrence-upload.component.html',
    styleUrls: ['./occurrence-upload.component.scss']
})
export class OccurrenceUploadComponent implements OnInit {
    private collectionID: number = null;
    public fileInput = new FormControl(null);

    constructor(
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap;
        if (qParams.has('collectionID')) {
            this.collectionID = parseInt(qParams.get('collectionID'));
        }
        else {
            this.router.navigate(['/']);
        }
    }

    onUpload() {
        console.log(this.fileInput.value);
    }
}
