import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPermissionsConfirmDialogComponent } from './collection-permissions-confirm-dialog.component';

describe('CollectionPermissionsConfirmDialogComponent', () => {
  let component: CollectionPermissionsConfirmDialogComponent;
  let fixture: ComponentFixture<CollectionPermissionsConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionPermissionsConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPermissionsConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
