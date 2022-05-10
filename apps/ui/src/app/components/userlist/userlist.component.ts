import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserOutputDto } from '@symbiota2/api-auth';
import { UserPanel } from '../../pages/userlist-page/userpanel-data';

@Component({
  selector: 'symbiota2-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})

export class UserlistComponent implements OnInit {
  @Input() userList: UserOutputDto[];
  @Input() userPanelList: UserPanel[];
  panelOpenState = true;

  constructor() { }

  ngOnInit(): void {
  }
}

