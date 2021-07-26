import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from "../../services/collection.service";
import { User, UserService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'symbiota2-collection-new-collection',
  templateUrl: './collection-new-collection.component.html',
  styleUrls: ['./collection-new-collection.component.scss']
})
export class CollectionNewCollectionComponent implements OnInit {
  
  user = new User; 

  newCollectionForm = this.fb.group({
    collectionName: ['', Validators.required],
    code: ['', Validators.required],
    // TODO: link institution id to drop down of institutions
    institutionID: ['1', Validators.required],
    description: ['', Validators.required],
    homepage: ['', Validators.required],
    contact: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    latitude: ['0', [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: ['0', [Validators.required, Validators.min(-180), Validators.max(180)]],
    category: ['', Validators.required],
    license: ['', Validators.required],
    aggregators: [false],
    icon: [''],
    type: ['', Validators.required],
    management: ['', Validators.required],
  });
  
  constructor(
    private fb: FormBuilder,
    private collections: CollectionService,
    private users: UserService) {}
  
  ngOnInit(): void {  
    this.users.currentUser.pipe(
      map(user => {
        return user;
      })
    ).subscribe(user => this.user = user);
    
  }

  onSubmit(): void {
    var newCollection = new CollectionInputDto(this.newCollectionForm.value);
    this.collections.createNewCollection(newCollection, this.user.token).subscribe(collection => //TODO: reroute to col page
      );
    console.log(this.newCollectionForm.value);
  }

}
