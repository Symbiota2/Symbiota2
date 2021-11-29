import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonomyConfirmDialogComponent } from './taxonomy-confirm-dialog-component/taxonomy-confirm-dialog.component';
import { TaxonomicAuthorityService, TaxonService } from '../../../services';
import { TaxonomyUploadService } from '../../../services/taxonomyUpload/taxonomy-upload.service';
import { Q_PARAM_AUTHORITYID } from '../../../../constants';
import { ROUTE_AUTHORITY_LIST, ROUTE_AUTHORITY_PROFILE } from '../../../routes';

interface TableRow {
    fieldName: string;
    options: Array<{ text: string, disabled: boolean }>;
    value: string;
}

@Component({
    selector: 'symbiota2-taxonomy-field-map',
    templateUrl: './field-map.component.html',
    styleUrls: ['./field-map.component.scss']
})
export class TaxonomyUploadFieldMapPage implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    //hidePageSize
    //hidePageOptions

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
        this.uploads.taxonomyFieldList.pipe(
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
    )

    dataSource = new MatTableDataSource<TableRow>();

    constructor(
        readonly taxaService: TaxonService,
        readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly loading: LoadingService,
        private readonly alerts: AlertService,
        private readonly currentRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly uploads: TaxonomyUploadService,
        private readonly dialog: MatDialog) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap;

        if (!qParams.has(Q_PARAM_AUTHORITYID)) {
            this.alerts.showError('Authority not found')
            this.router.navigate([ROUTE_AUTHORITY_LIST])
        }

        if (!qParams.has('uploadID')) {
            this.alerts.showError('Invalid upload')
            this.router.navigate([ROUTE_AUTHORITY_LIST])
        }

        let authorityID = parseInt(qParams.get(Q_PARAM_AUTHORITYID))
        authorityID = Number.isInteger(authorityID) ? authorityID : null
        this.taxonomicAuthorityService.setAuthorityID(authorityID)

        let uploadID = parseInt(qParams.get('uploadID'))
        uploadID = Number.isInteger(uploadID) ? uploadID : null
        this.uploads.setUploadID(uploadID)

        this.tableData.subscribe((data) => {
            this.dataSource.data = data
        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
    }

    setFieldMapValue(key: string, value: string) {
        this.uploads.setFieldMap(key, value)
    }

    onSubmit() {
        this.uploads.patchFieldMap(this.uniqueIDField.value).subscribe(({ newRecords, updatedRecords, nullRecords }) => {
            const confirmDialog = this.dialog.open(
                TaxonomyConfirmDialogComponent,
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
                        this.taxonomicAuthorityService.getAuthorityID().pipe(filter((c) => c !== null)),
                        this.uploads.startUpload()
                    ]).pipe(
                        take(1)
                    ).subscribe(([authority,]) => {
                        this.router.navigate(
                            [ROUTE_AUTHORITY_PROFILE.replace(':authorityID', authority.toString())]
                        )
                    })
                }
            })
        })
    }
}
