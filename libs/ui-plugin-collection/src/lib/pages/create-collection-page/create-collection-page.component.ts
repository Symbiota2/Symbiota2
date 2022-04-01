import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ROUTE_COLLECTION_LIST, ROUTE_COLLECTION_PROFILE } from '../../routes';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from '../../services/collection.service';
import { CollectionNewCollectionComponent } from '../../components/create-collection-form/create-collection-form.component';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'symbiota2-collection-new-page',
    templateUrl: './create-collection-page.component.html',
    styleUrls: ['./create-collection-page.component.scss'],
})
export class CollectionCreatePage implements OnInit {
    @ViewChild(CollectionNewCollectionComponent) form!: CollectionNewCollectionComponent; 


    constructor(
        private readonly collectionService: CollectionService,
        private readonly user: UserService,
        private readonly rt: Router,
        private readonly alertService: AlertService,
    ) {}

    ngOnInit(): void {
        this.user.currentUser
            .subscribe((user) => {
                if (user == null || !user.isSuperAdmin()) {
                    this.rt.navigate(['/' + ROUTE_COLLECTION_LIST]);
                }
            })
            .unsubscribe();
    }


}
