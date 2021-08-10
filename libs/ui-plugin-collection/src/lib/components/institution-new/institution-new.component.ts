import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InstitutionInputDto } from '../../dto/Institution.input.dto';
import { InstitutionService } from '../../services/institution.service';
import { User, UserService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { Institution } from '@symbiota2/api-database';
import { InstitutionAsyncValidators } from './validators';

@Component({
    selector: 'symbiota2-institution-new',
    templateUrl: './institution-new.component.html',
    styleUrls: ['./institution-new.component.scss'],
})
export class InstitutionNewComponent implements OnInit {
    @Output()
    submitClicked = new EventEmitter<Institution>();


    private user: User;

    constructor(
        private fb: FormBuilder,
        private institutions: InstitutionService,
        private users: UserService
    ) {}

    newInstForm = this.fb.group({
        code: ['', Validators.required],
        name: ['', Validators.required, InstitutionAsyncValidators.nameTaken(this.institutions)],
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        stateProvince: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        phone: ['', Validators.required],
        contact: ['', Validators.required],
        email: ['', Validators.required],
        url: [''],
        notes: [''],
    });

    ngOnInit(): void {
        this.getUser();
    }

    onSubmit(): void {
        if(this.user.isSuperAdmin()){ //NOTE: user is required to be superAdmin to create new institution
            var newInst = new InstitutionInputDto(this.newInstForm.value);
            this.institutions
                .createInstitution(newInst, this.user.token)
                .subscribe(inst => {
                  this.submitClicked.emit(inst);
                });
        }
    }

    getUser(): void {
        this.users.currentUser
            .pipe(
                map((user) => {
                    return user;
                })
            )
            .subscribe((user) => (this.user = user));
    }
}
