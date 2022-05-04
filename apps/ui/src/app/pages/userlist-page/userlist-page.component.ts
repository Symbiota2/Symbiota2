import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { User, UserService, UserRole } from '@symbiota2/ui-common';
import { RoleOutputDto, UserOutputDto } from '@symbiota2/api-auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserPanel } from './userpanel-data';


@Component({
  selector: 'symbiota2-userlist-page',
  templateUrl: './userlist-page.component.html',
  styleUrls: ['./userlist-page.component.scss'],
})

export class UserlistPageComponent implements OnInit {
  currentUser$ = this.userService.currentUser;
  user: User;
  isSuperAdmin = false;
  userList: UserOutputDto[];
  userPerms: RoleOutputDto[][];
  userPanelList: UserPanel[];
  sitePermsForm: FormGroup;
  occurencePermsForm: FormGroup;

  constructor(
    private readonly userService: UserService,
    fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.userPerms = [];
    this.userPanelList = [];
    //Get user list and load data only they are a superadmin
    //Check if superAdmin
    this.currentUser$.subscribe(user => {
      this.user = user;
      this.isSuperAdmin = user.isSuperAdmin();
      if (this.user && this.isSuperAdmin) {
        const userList$ = this.userService.getUsers();
        userList$.subscribe(userList => {
          this.userList = userList;
          userList.forEach(user => {
            const currUserPerms$ = this.userService.getUserRolesById(user.uid);
            currUserPerms$.subscribe(currUserRoles => {
              this.userPerms.push(currUserRoles);
              let currPanel = new UserPanel(user, currUserRoles);
              this.userPanelList.push(currPanel);
            })
          });
        })
      }

    });
    console.log("USER PERMS", this.userPerms);
    console.log("USER PANELS", this.userPanelList);

  }


}
