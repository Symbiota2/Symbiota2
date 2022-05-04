import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserPanel } from '../../pages/userlist-page/userpanel-data';

@Component({
  selector: 'symbiota2-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {
  @Input() userPanel: UserPanel;
  //Role names ripped from the ApiUserRoleName enum to use here on the ui.
  CHECKLIST_ADMIN = "ClAdmin";
  COLLECTION_ADMIN = "CollAdmin";
  COLLECTION_EDITOR = "CollEditor";
  ROLE_COLLECTION_TAXON_EDITOR = "CollTaxon";
  ROLE_KEY_ADMIN = "KeyAdmin";
  ROLE_KEY_EDITOR = "KeyEditor";
  PROJECT_ADMIN = "ProjAdmin";
  RARE_SPECIES_ADMIN = "RareSppAdmin";
  ROLE_RARE_SPP_EDITOR = "RareSppReader";
  RARE_SPECIES_READER = "RareSppReadAll";
  SUPER_ADMIN = "SuperAdmin";
  TAXON_EDITOR = "Taxonomy";
  TAXON_PROFILE_EDITOR = "TaxonProfile";

  permsForm: FormGroup;

  constructor(fb: FormBuilder,) { }

  ngOnInit(): void {
  }

}
