import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxonStatusAcceptedEditorDialogComponent } from '@symbiota2/ui-plugin-taxonomy';

describe('TaxonStatusAcceptedEditorDialogComponent', () => {
  let component: TaxonStatusAcceptedEditorDialogComponent
  let fixture: ComponentFixture<TaxonStatusAcceptedEditorDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonStatusAcceptedEditorDialogComponent ]
    })
    .compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonStatusAcceptedEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
