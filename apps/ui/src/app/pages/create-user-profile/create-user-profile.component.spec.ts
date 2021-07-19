import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserProfilePage } from './create-user-profile.component';

describe('CreateUserProfileComponent', () => {
  let component: CreateUserProfilePage;
  let fixture: ComponentFixture<CreateUserProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserProfilePage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
