import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUsernamePage } from './forgot-username.component';

describe('ForgotUsernameComponent', () => {
  let component: ForgotUsernamePage;
  let fixture: ComponentFixture<ForgotUsernamePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotUsernamePage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotUsernamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
