import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Occurrence } from '../../dto/occurrence';
import { OccurrenceService } from '../../services/occurrence.service';
import { filter, map, skip, startWith } from 'rxjs/operators';
import { OccurrenceExtraField } from './occurrence-extra-field';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

@Component({
    selector: 'symbiota2-occurrence-editor',
    templateUrl: './occurrence-editor.component.html',
    styleUrls: ['./occurrence-editor.component.scss']
})
export class OccurrenceEditorComponent implements OnInit {
    readonly ADDITIONAL_FIELDS = new Map<string, OccurrenceExtraField>([
        ['associatedCollectors', { i18nStr: 'plugins.occurrence.fields.associatedCollectors', value: "" }],
        ['coordinateUncertaintyInMeters', { i18nStr: 'plugins.occurrence.fields.coordUncertainty', value: "0", type: 'number' }],
        ['disposition', { i18nStr: 'plugins.occurrence.fields.disposition', value: "" }],
        ['establishmentMeans', { i18nStr: 'plugins.occurrence.fields.establishmentMeans', value: "" }],
        ['fieldNumber', { i18nStr: 'plugins.occurrence.fields.fieldNumber', value: "" }],
        ['geodeticDatum', { i18nStr: 'plugins.occurrence.fields.geodeticDatum', value: "" }],
        ['habitat', { i18nStr: 'plugins.occurrence.fields.habitat', value: "" }],
        ['identificationQualifier', { i18nStr: 'plugins.occurrence.fields.identificationQualifier', value: "" }],
        ['individualCount', { i18nStr: 'plugins.occurrence.fields.individualCount', value: "0", type: 'number' }],
        ['labelProject', { i18nStr: 'plugins.occurrence.fields.labelProject', value: "" }],
        ['language', { i18nStr: 'plugins.occurrence.fields.language', value: "" }],
        ['lifeStage', { i18nStr: 'plugins.occurrence.fields.lifeStage', value: "" }],
        ['maximumDepthInMeters', { i18nStr: 'plugins.occurrence.fields.depthInMetersMax', value: "0", type: 'number' }],
        ['maximumElevationInMeters', { i18nStr: 'plugins.occurrence.fields.elevationInMetersMax', value: "0", type: 'number' }],
        ['minimumDepthInMeters', { i18nStr: 'plugins.occurrence.fields.depthInMetersMin', value: "0", type: 'number' }],
        ['minimumElevationInMeters', { i18nStr: 'plugins.occurrence.fields.elevationInMetersMin', value: "0", type: 'number' }],
        ['otherCatalogNumbers', { i18nStr: 'plugins.occurrence.fields.otherCatalogNumbers', value: '' }],
        ['phenology', { i18nStr: 'plugins.occurrence.fields.phenology', value: '' }],
        ['preparations', { i18nStr: 'plugins.occurrence.fields.preparations', value: '' }],
        ['samplingProtocol', { i18nStr: 'plugins.occurrence.fields.samplingProtocol', value: '' }],
        ['sex', { i18nStr: 'plugins.occurrence.fields.sex', value: '' }],
        ['substrate', { i18nStr: 'plugins.occurrence.fields.substrate', value: '' }],
        ['typeStatus', { i18nStr: 'plugins.occurrence.fields.typeStatus', value: '' }],
        ['verbatimCoordinates', { i18nStr: 'plugins.occurrence.fields.verbatimCoordinates', value: '' }],
        ['verbatimDepth', { i18nStr: 'plugins.occurrence.fields.verbatimDepth', value: '' }],
        ['verbatimElevation', { i18nStr: 'plugins.occurrence.fields.verbatimElevation', value: '' }],
        ['verbatimEventDate', { i18nStr: 'plugins.occurrence.fields.verbatimEventDate', value: '' }],
    ]);

    // Collector info
    formControlCatalogNumber = new FormControl('');
    formControlCollector = new FormControl('');
    formControlRecordNumber = new FormControl('');
    formControlEventDate = new FormControl(null);

    // Latest ID
    formControlScientificName = new FormControl('');
    formControlAuthor = new FormControl('');
    formControlFamily = new FormControl('');
    formControlIdentifiedBy = new FormControl('');
    formControlDateIdentified = new FormControl(null);

    // Locality
    formControlCountry = new FormControl('');
    formControlStateProvince = new FormControl('');
    formControlCounty = new FormControl('');
    formControlMunicipality = new FormControl('');
    formControlLocality = new FormControl('');
    formControlLatitude = new FormControl(null);
    formControlLongitude = new FormControl(null);
    formControlLocalitySecurity = new FormControl(false);

    form = new FormGroup({
        'catalogNumber': this.formControlCatalogNumber,
        'collector': this.formControlCollector,
        'recordNumber': this.formControlRecordNumber,
        'eventDate': this.formControlEventDate,
        'verbatimEventDate': this.formControlEventDate,

        'scientificName': this.formControlScientificName,
        'scientificNameAuthorship': this.formControlAuthor,
        'family': this.formControlFamily,
        'identifiedBy': this.formControlIdentifiedBy,
        'dateIdentified': this.formControlDateIdentified,

        'country': this.formControlCountry,
        'stateProvince': this.formControlStateProvince,
        'county': this.formControlCounty,
        'municipality': this.formControlMunicipality,
        'locality': this.formControlLocality,
        'latitude': this.formControlLatitude,
        'longitude': this.formControlLongitude,
        'localitySecurity': this.formControlLocalitySecurity
    });

    @Input() occurrence: Occurrence | null = null;
    @Output() formChanged = new EventEmitter<Partial<Occurrence>>();

    numExtraFields = 1;
    private extraFields = new BehaviorSubject<Record<string, unknown>>({});

    constructor(private readonly occurrences: OccurrenceService) { }

    get disabledAdditionalFields() {
        return Object.keys(this.extraFields.getValue());
    }

    get valueChanges(): Observable<Record<string, unknown>> {
        // When either the form or extra fields change
        return combineLatest([
            this.form.valueChanges.pipe(startWith({})),
            this.extraFields
        ]).pipe(
            skip(1),
            map(() => {
                return { ...this.form.value, ...this.extraFields.getValue() }
            })
        );
    }

    counter(n: number): unknown[] {
        return new Array(n);
    }

    ngOnInit() {
        this.valueChanges.subscribe((formData) => {
            this.formChanged.emit(formData);
        });

        if (this.occurrence !== null) {
            const extraFields = {};
            const formValues = {};

            for (const [key, value] of Object.entries(this.occurrence)) {
                if (this.ADDITIONAL_FIELDS.has(key)) {
                    extraFields[key] = value;
                }
                else {
                    formValues[key] = value;
                }
            }

            this.extraFields.next(extraFields);
            this.form.patchValue(formValues);
        }
    }

    onExtraField({ key, value }): void {
        const currentExtras = this.extraFields.getValue();
        const newExtras = { ...currentExtras, [key]: value };
        this.extraFields.next(newExtras);
    }
}
