import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'symbiota2-collection-new-collection',
  templateUrl: './collection-new-collection.component.html',
  styleUrls: ['./collection-new-collection.component.scss']
})
export class CollectionNewCollectionComponent implements OnInit {

  newCollectionForm = this.fb.group({
    name: [''],
    code: [''],
    desc: [''],
    homepage: [''],
    contact: [''],
    email: [''],
    latitude: [''],
    longitude: [''],
    category: [''],
    license: [''],
    aggregators: [''],
    icon: [''],
    type: [''],
    management: [''],
  });
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    
  }

  

}
