import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCommentPage } from './collection-comment-page.component';

describe('CollectionCommentPage', () => {
  let component: CollectionCommentPage;
  let fixture: ComponentFixture<CollectionCommentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionCommentPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCommentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    expect(component).toBeTruthy();
  });
});
