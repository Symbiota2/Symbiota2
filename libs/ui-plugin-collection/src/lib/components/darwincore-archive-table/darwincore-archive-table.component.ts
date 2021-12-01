import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { CollectionArchive } from '../../dto/DwcCollection.dto';
import { DarwinCoreArchiveService } from '../../services/darwin-core-archive.service';
import { DwcArchiveDataSource } from './dwc-archive-datasource';

@Component({
  selector: 'symbiota2-darwincore-archive-table',
  templateUrl: './darwincore-archive-table.component.html',
  styleUrls: ['./darwincore-archive-table.component.scss']
})
export class DarwincoreArchiveTableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<CollectionArchive>;
  dataSource: DwcArchiveDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'date', 'size'];

  constructor(private readonly dwcService: DarwinCoreArchiveService){}

  ngOnInit() {
    this.dataSource = new DwcArchiveDataSource(this.dwcService);
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

