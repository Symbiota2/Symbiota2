import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonEditorDialogComponent } from './taxon-editor-dialog.component';

describe('TaxonEditorDialogComponent', () => {
  let component: TaxonEditorDialogComponent
  let fixture: ComponentFixture<TaxonEditorDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonEditorDialogComponent ]
    })
    .compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
