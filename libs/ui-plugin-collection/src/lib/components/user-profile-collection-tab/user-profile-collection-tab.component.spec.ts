import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileCollectionTab } from './user-profile-collection-tab.component';

describe('UserProfileCollectionTabComponent', () => {
  let component: UserProfileCollectionTab;
  let fixture: ComponentFixture<UserProfileCollectionTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileCollectionTab ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileCollectionTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
