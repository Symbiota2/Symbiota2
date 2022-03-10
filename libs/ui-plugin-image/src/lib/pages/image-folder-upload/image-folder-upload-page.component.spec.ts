import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageFolderUploadPage } from './image-folder-upload-page.component';

describe('UploadComponent', () => {
  let component: ImageFolderUploadPage;
  let fixture: ComponentFixture<ImageFolderUploadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageFolderUploadPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFolderUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
