import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCommentComponent } from './collection-comment.component';

describe('CollectionCommentComponent', () => {
  let component: CollectionCommentComponent;
  let fixture: ComponentFixture<CollectionCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
