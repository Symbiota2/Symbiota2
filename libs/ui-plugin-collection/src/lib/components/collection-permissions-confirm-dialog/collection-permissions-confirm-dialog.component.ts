import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'symbiota2-collection-permissions-confirm-dialog',
  templateUrl: './collection-permissions-confirm-dialog.component.html',
  styleUrls: ['./collection-permissions-confirm-dialog.component.scss']
})
export class CollectionPermissionsConfirmDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public bodyText: string,
    private readonly dialogRef: MatDialogRef<CollectionPermissionsConfirmDialogComponent>) { }

  ngOnInit(): void {
  }

  onConfirm(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close(false);
  }

}
