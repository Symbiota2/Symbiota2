import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxonDescriptionStatementDialogComponent } from './taxon-description-statement-dialog.component';

describe('TaxonDescriptionStatementDialogComponent', () => {
  let component: TaxonDescriptionStatementDialogComponent
  let fixture: ComponentFixture<TaxonDescriptionStatementDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonDescriptionStatementDialogComponent ]
    })
    .compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonDescriptionStatementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
