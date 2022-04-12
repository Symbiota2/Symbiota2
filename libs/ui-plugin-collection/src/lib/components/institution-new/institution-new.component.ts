import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InstitutionInputDto } from '../../dto/Institution.input.dto';
import { InstitutionService } from '../../services/institution.service';
import { Institution } from '@symbiota2/api-database';
import { InstitutionAsyncValidators } from '../../validators/InstitutionValidators';

@Component({
    selector: 'symbiota2-institution-new',
    templateUrl: './institution-new.component.html',
    styleUrls: ['./institution-new.component.scss'],
})
export class InstitutionNewComponent implements OnInit {
    @Output()
    submitClicked = new EventEmitter<Institution>();

    constructor(
        private fb: FormBuilder,
        private institutions: InstitutionService
    ) {}

    newInstForm = this.fb.group({
        code: [
            '',
            Validators.required,
            InstitutionAsyncValidators.codeTaken(this.institutions),
        ],
        name: [
            '',
            Validators.required,
            InstitutionAsyncValidators.nameTaken(this.institutions),
        ],
        address1: ['', ],
        address2: [''],
        city: ['', ],
        stateProvince: ['', ],
        postalCode: ['', ],
        country: ['', ],
        phone: ['', ],
        contact: ['', ],
        email: ['', ],
        url: [''],
        notes: [''],
    });

    ngOnInit(): void {}

    onSubmit(): void {
        var newInst = new InstitutionInputDto(this.newInstForm.value);

        this.institutions.createInstitution(newInst).subscribe((inst) => {
            this.submitClicked.emit(inst); //send institution to parent
        });
    }
}
