import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { User, UserService } from '@symbiota2/ui-common';
import { UserOutputDto } from '@symbiota2/api-auth';

@Component({
  selector: 'symbiota2-userlist-page',
  templateUrl: './userlist-page.component.html',
  styleUrls: ['./userlist-page.component.scss'],
})

export class UserlistPageComponent implements OnInit {
  currentUser$ = this.userService.currentUser;
  user: User;
  isSuperAdmin: Boolean;
  userList: UserOutputDto[];

  constructor(
    private readonly userService: UserService,
  ) { }
  ngOnInit(): void {
    //Get user list and load data only they are a superadmin
    //Check if superAdmin
    this.currentUser$.subscribe(user => {
      this.user = user;
      if (this.user && user.isSuperAdmin()) {
        const userList$ = this.userService.getUsers();
        userList$.subscribe(userList => {
          this.userList = userList;
        })
      }
    });

  }
}
