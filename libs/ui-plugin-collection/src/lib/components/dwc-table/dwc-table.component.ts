import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { DwcArchive } from '@symbiota2/ui-plugin-collection';
import { DwcService } from '../../services/dwc.service';
import { DwcTableDataSource } from './dwc-table-datasource';

@Component({
  selector: 'symbiota2-dwc-table',
  templateUrl: './dwc-table.component.html',
  styleUrls: ['./dwc-table.component.scss']
})
export class DwcTableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<DwcArchive>;
  dataSource: DwcTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'date', 'size'];

  constructor(private readonly dwcService: DwcService){}

  ngOnInit() {
    this.dataSource = new DwcTableDataSource(this.dwcService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}

