import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwcTableComponent } from './dwc-table.component';

describe('DwcTableComponent', () => {
  let component: DwcTableComponent;
  let fixture: ComponentFixture<DwcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwcTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
