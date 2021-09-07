import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionToolsPageComponent } from './collection-tools-page.component';

describe('CollectionToolsPageComponent', () => {
  let component: CollectionToolsPageComponent;
  let fixture: ComponentFixture<CollectionToolsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionToolsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionToolsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
