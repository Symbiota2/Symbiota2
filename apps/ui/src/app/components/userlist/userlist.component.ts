import { Component, Input, OnInit } from '@angular/core';
import { UserOutputDto } from '@symbiota2/api-auth';

@Component({
  selector: 'symbiota2-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
  @Input() userList: UserOutputDto[];
  panelOpenState = false;

  constructor() { }

  ngOnInit(): void {
  }

}
