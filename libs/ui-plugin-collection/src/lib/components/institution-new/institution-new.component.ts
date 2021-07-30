import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'symbiota2-institution-new',
  templateUrl: './institution-new.component.html',
  styleUrls: ['./institution-new.component.scss']
})
export class InstitutionNewComponent implements OnInit {

  @Output()
  submitClicked = new EventEmitter<void>();

  constructor(private fb: FormBuilder) { }

  newInstForm = this.fb.group({
    code: ["", Validators.required],
    name: ["", Validators.required],
    address1: ["", Validators.required],
    address2: ["", ],
    city: ["", Validators.required],
    stateProvince: ["", Validators.required],
    postalCode: ["", Validators.required],
    country: ["", Validators.required],
    phone: ["", Validators.required],
    contact: ["", Validators.required],
    email: ["", Validators.required],
    url: ["", ],
    notes: ["",],
  })

  ngOnInit(): void {
  }

  onSubmit(): void{
    this.submitClicked.emit();
    //TODO: create institution
  }

}
