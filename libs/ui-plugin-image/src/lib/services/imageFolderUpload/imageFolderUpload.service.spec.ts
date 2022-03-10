import { TestBed } from '@angular/core/testing';
import { ImageFolderUploadService } from './imageFolderUpload.service';

describe('ImageFolderUploadService', () => {
  let service: ImageFolderUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageFolderUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
