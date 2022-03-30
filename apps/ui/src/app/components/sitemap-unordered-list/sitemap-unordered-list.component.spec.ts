import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemapUnorderedListComponent } from './sitemap-unordered-list.component';

describe('SitemapUnorderedListComponent', () => {
  let component: SitemapUnorderedListComponent;
  let fixture: ComponentFixture<SitemapUnorderedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitemapUnorderedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemapUnorderedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
