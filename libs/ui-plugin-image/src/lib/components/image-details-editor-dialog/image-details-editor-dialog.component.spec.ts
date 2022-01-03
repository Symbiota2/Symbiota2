import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDetailsEditorDialogComponent } from './image-details-editor-dialog.component';

describe('ImageDetailsEditorDialogComponent', () => {
  let component: ImageDetailsEditorDialogComponent
  let fixture: ComponentFixture<ImageDetailsEditorDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageDetailsEditorDialogComponent ]
    })
    .compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDetailsEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
