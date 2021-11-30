import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'symbiota2-darwincore-archive-table',
  templateUrl: './darwincore-archive-table.component.html',
  styleUrls: ['./darwincore-archive-table.component.scss']
})
export class DarwincoreArchiveTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
