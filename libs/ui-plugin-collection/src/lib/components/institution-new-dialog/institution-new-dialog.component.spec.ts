import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionNewDialogComponent } from './institution-new-dialog.component';

describe('InstitutionNewDialogComponent', () => {
  let component: InstitutionNewDialogComponent;
  let fixture: ComponentFixture<InstitutionNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionNewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
