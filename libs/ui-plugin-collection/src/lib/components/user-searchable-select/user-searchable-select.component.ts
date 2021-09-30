import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserOutputDto } from '@symbiota2/api-auth';
import { UserService } from '@symbiota2/ui-common';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'symbiota2-user-searchable-select',
  templateUrl: './user-searchable-select.component.html',
  styleUrls: ['./user-searchable-select.component.scss']
})
export class UserSearchableSelectComponent implements OnInit {

  users$: Observable<UserOutputDto[]>

  private searchTerms = new Subject<string>();

  @Output() selectUser = new EventEmitter<UserOutputDto>();

  user = new FormControl();

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.userService.getUsers(term))
    )
  }

  search(term: string): void{
    this.searchTerms.next(term);
  }

  onSelectUser(user: UserOutputDto): void{
    this.selectUser.emit(user);
  }

}
