import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OccurrenceService } from '../../../services/occurrence.service';
import { AlertService, LoadingService } from '@symbiota2/ui-common';
import { combineLatest, Observable, of } from 'rxjs';
import {
    filter,
    finalize,
    map,
    shareReplay,
    switchMap,
    take,
    tap
} from 'rxjs/operators';
import { OccurrenceUploadService } from '../../../services/occurrence-upload.service';
import { Q_PARAM_COLLID } from '../../../../constants';
import {
    CollectionService,
    ROUTE_COLLECTION_LIST, ROUTE_COLLECTION_PROFILE
} from '@symbiota2/ui-plugin-collection';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog-component/confirm-dialog.component';

interface TableRow {
    fieldName: string;
    options: Array<{ text: string, disabled: boolean }>;
    value: string;
}

@Component({
    selector: 'symbiota2-field-map',
    templateUrl: './field-map.component.html',
    styleUrls: ['./field-map.component.scss']
})
export class OccurrenceUploadFieldMapPage implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    uniqueIDField = new FormControl('', [Validators.required]);

    uniqueIDOptions = this.uploads.currentUpload.pipe(
        map((upload) => {
            if (!upload) {
                return [];
            }
            return Object.keys(upload.fieldMap)
        })
    );

    fieldMap = this.uploads.currentUpload.pipe(
        filter((upload) => upload !== null),
        map((upload) => upload.fieldMap)
    );

    tableData: Observable<TableRow[]> = combineLatest([
        this.fieldMap,
        this.uploads.occurrenceFieldList.pipe(
            map((fields) => fields.sort()),
            shareReplay(1)
        ),
    ]).pipe(
        map(([fieldMap, apiFields]) => {
            return Object.keys(fieldMap).map((field) => {
                return {
                    fieldName: field,
                    value: fieldMap[field],
                    options: apiFields.map((optionText) => {
                        return {
                            text: optionText,
                            disabled: Object.values(fieldMap).includes(optionText)
                        }
                    }),
                }
            })
        })
    );

    dataSource = new MatTableDataSource<TableRow>();

    constructor(
        readonly collection: CollectionService,
        private readonly loading: LoadingService,
        private readonly alerts: AlertService,
        private readonly currentRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly occurrences: OccurrenceService,
        private readonly uploads: OccurrenceUploadService,
        private readonly dialog: MatDialog) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap;

        if (!qParams.has(Q_PARAM_COLLID)) {
            this.alerts.showError('Collection not found');
            this.router.navigate([ROUTE_COLLECTION_LIST]);
        }

        if (!qParams.has('uploadID')) {
            this.alerts.showError('Invalid upload');
            this.router.navigate([ROUTE_COLLECTION_LIST]);
        }

        let collID = parseInt(qParams.get(Q_PARAM_COLLID));
        collID = Number.isInteger(collID) ? collID : null;
        this.collection.setCollectionID(collID);

        let uploadID = parseInt(qParams.get('uploadID'));
        uploadID = Number.isInteger(uploadID) ? uploadID : null;
        this.uploads.setUploadID(uploadID);

        this.tableData.subscribe((data) => {
            this.dataSource.data = data;
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    setFieldMapValue(key: string, value: string) {
        this.uploads.setFieldMap(key, value);
    }

    onSubmit() {
        this.uploads.patchFieldMap(this.uniqueIDField.value).subscribe(({ newRecords, updatedRecords, nullRecords }) => {
            const confirmDialog = this.dialog.open(
                ConfirmDialogComponent,
                {
                    data: {
                        newRecords,
                        updatedRecords,
                        nullRecords
                    }
                }
            );
            confirmDialog.afterClosed().subscribe((shouldContinue) => {
                if (shouldContinue) {
                    combineLatest([
                        this.collection.currentCollection.pipe(filter((c) => c !== null)),
                        this.uploads.startUpload()
                    ]).pipe(
                        take(1)
                    ).subscribe(([collection,]) => {
                        this.router.navigate(
                            [ROUTE_COLLECTION_PROFILE.replace(':collectionID', collection.id.toString())]
                        );
                    })
                }
            });
        });
    }
}
