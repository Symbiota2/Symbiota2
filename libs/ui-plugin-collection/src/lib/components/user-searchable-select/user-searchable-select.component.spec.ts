import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchableSelectComponent } from './user-searchable-select.component';

describe('UserSearchableSelectComponent', () => {
  let component: UserSearchableSelectComponent;
  let fixture: ComponentFixture<UserSearchableSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSearchableSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
