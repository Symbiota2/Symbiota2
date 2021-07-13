import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'symbiota2-collection-new-collection',
  templateUrl: './collection-new-collection.component.html',
  styleUrls: ['./collection-new-collection.component.scss']
})
export class CollectionNewCollectionComponent implements OnInit {

  newCollectionForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    desc: ['', Validators.required],
    homepage: ['', Validators.required],
    contact: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required],
    category: ['', Validators.required],
    license: ['', Validators.required],
    aggregators: [''],
    icon: ['', ],
    type: ['', Validators.required],
    management: ['', Validators.required],
  });
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    
  }

  onSubmit(): void {
    //TODO: add functionality
    console.log(this.newCollectionForm.value);
  }

}
