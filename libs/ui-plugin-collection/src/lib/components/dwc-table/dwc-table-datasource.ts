import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DwcArchive } from '@symbiota2/ui-plugin-collection';
import { merge, observable, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DwcService } from '../../services/dwc.service';

interface DwcTableItem {}

export class DwcTableDataSource implements DataSource<DwcTableItem> {
    paginator: MatPaginator;
    sort: MatSort;
    data: Observable<DwcArchive[]> = this.dwcService.archiveList$;

    constructor(private readonly dwcService: DwcService) {}

    connect(): Observable<DwcArchive[]> {
        
        const dataMutations = [this.data, this.paginator.page, this.sort.sortChange];

        return this.data.pipe(
            switchMap((list) => {
                this.paginator.length = list.length;

                list.forEach((collection)=>{
                    collection.updatedAt = new Date(collection.updatedAt);
                })

                return merge(...dataMutations).pipe(map(() => {
                    return this.getPagedData(this.getSortedData([...list]));
                  }));
            })
        );
    }

    private getPagedData(data: DwcArchive[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    private getSortedData(data: DwcArchive[]) {
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'name':
                    return compare(a.archive, b.archive, isAsc);
                case 'date':
                    return compare(a.updatedAt, b.updatedAt, isAsc);
                case 'size':
                    return compare(+a.updatedAt, +b.updatedAt, isAsc);
                case 'id':
                    return compare(+a.collectionID, +b.collectionID, isAsc);
                default:
                    return 0;
            }
        });
    }

    disconnect(): void {
        //TODO: clean up any subscriptions
    }
}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
