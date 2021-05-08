import {
    AfterViewInit,
    Component,
    OnInit,
    QueryList,
    ViewChildren
} from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { Observable } from 'rxjs';
import { CollectionCategory } from '../../dto/Category.output.dto';

@Component({
    selector: 'symbiota2-collection-list-page',
    templateUrl: './collection-list-page.component.html',
    styleUrls: ['./collection-list-page.component.scss']
})
export class CollectionListPage implements OnInit {
    expandAll = true;
    categories: Observable<CollectionCategory[]>;

    constructor(private readonly collectionService: CollectionService) { }

    ngOnInit() {
        this.categories = this.collectionService.categories();
    }

    onExpandCollapse(isExpanded: boolean) {
        this.expandAll = isExpanded;
    }
}
