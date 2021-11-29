import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyConfirmDialogComponent } from './taxonomy-confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: TaxonomyConfirmDialogComponent;
  let fixture: ComponentFixture<TaxonomyConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonomyConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomyConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
