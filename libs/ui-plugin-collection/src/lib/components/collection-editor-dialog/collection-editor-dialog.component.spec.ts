import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionEditorDialogComponent } from './collection-editor-dialog.component';

describe('CollectionEditorDialogComponent', () => {
  let component: CollectionEditorDialogComponent;
  let fixture: ComponentFixture<CollectionEditorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionEditorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
