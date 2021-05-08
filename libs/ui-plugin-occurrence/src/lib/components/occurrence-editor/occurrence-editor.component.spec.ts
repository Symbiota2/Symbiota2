import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceEditorComponent } from './occurrence-editor.component';

describe('OccurrenceEditorComponent', () => {
  let component: OccurrenceEditorComponent;
  let fixture: ComponentFixture<OccurrenceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
