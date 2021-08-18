import {
    Component,
    Output,
    EventEmitter,
    OnInit,
    Input,
    OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Occurrence } from '../../dto/occurrence';
import { filter, map, switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { TaxonService } from '@symbiota2/ui-plugin-taxonomy';
import {
    CountryService,
    StateProvinceService
} from '@symbiota2/ui-plugin-geography';

@Component({
    selector: 'symbiota2-occurrence-editor',
    templateUrl: './occurrence-editor.component.html',
    styleUrls: ['./occurrence-editor.component.scss']
})
export class OccurrenceEditorComponent implements OnInit, OnDestroy {
    private valueChangeSubscription: Subscription = null;

    form = new FormGroup({
        // Collector info
        'catalogNumber': new FormControl(''),
        'recordedBy': new FormControl(''),
        'recordNumber': new FormControl(''),
        'eventDate': new FormControl(null),
        'verbatimEventDate': new FormControl(''),

        // Latest identification
        'scientificName': new FormControl(''),
        'scientificNameAuthorship': new FormControl(''),
        'family': new FormControl({ value: '', disabled: true }),
        'identifiedBy': new FormControl(''),
        'dateIdentified': new FormControl(null),

        // Locality
        'country': new FormControl(''),
        'stateProvince': new FormControl(''),
        'county': new FormControl(''),
        'municipality': new FormControl(''),
        'locality': new FormControl(''),
        'latitude': new FormControl(null),
        'longitude': new FormControl(null),
        'localitySecurity': new FormControl(false)

        // Misc

        // Curation
    });

    @Input() occurrence: Occurrence | null = null;
    @Output() formChanged = new EventEmitter<Partial<Occurrence>>();

    constructor(
        private readonly countries: CountryService,
        private readonly stateProvinces: StateProvinceService,
        private readonly taxa: TaxonService) { }

    autoCompleteCountries = this.createAutoComplete<string>('country').pipe(
        switchMap((country) => {
            console.log(country);
            this.countries.setQueryParams({
                countryTerm: country,
                limit: 5
            });
            return this.countries.countryList;
        }),
        map((provinces) => {
            return provinces.map((country) => country.countryTerm)
        })
    );
    autoCompleteStateProvinces = this.createAutoComplete<string>('stateProvince').pipe(
        switchMap((state) => {
            this.stateProvinces.setQueryParams({
                stateTerm: state,
                limit: 5
            });
            return this.stateProvinces.provinceList;
        }),
        map((provinces) => {
            return provinces.map((province) => province.stateTerm)
        })
    );
    // TODO: Add limit & disable loading screen
    autoCompleteTaxa = this.createAutoComplete<string>('scientificName').pipe(
        switchMap((sciName) => {
            return this.taxa.findAllScientificNames(sciName)
        })
    );

    valueChanges: Observable<Record<string, unknown>> = this.form.valueChanges.pipe(
        map(() => this.form.value)
    );

    ngOnInit() {
        if (this.occurrence) {
            this.form.patchValue(this.occurrence);
        }
        this.valueChangeSubscription = this.valueChanges.subscribe((formData) => {
            this.formChanged.emit(formData);
        });
    }

    ngOnDestroy() {
        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
        this.valueChangeSubscription = null;
    }

    private createAutoComplete<T>(fieldName: string): Observable<T> {
        return this.form.get(fieldName).valueChanges.pipe(
            filter((val) => !!val),
        );
    }
}
