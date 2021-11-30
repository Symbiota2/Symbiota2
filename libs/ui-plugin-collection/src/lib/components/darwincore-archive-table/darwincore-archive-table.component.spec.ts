import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarwincoreArchiveTableComponent } from './darwincore-archive-table.component';

describe('DarwincoreArchiveTableComponent', () => {
  let component: DarwincoreArchiveTableComponent;
  let fixture: ComponentFixture<DarwincoreArchiveTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarwincoreArchiveTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarwincoreArchiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
