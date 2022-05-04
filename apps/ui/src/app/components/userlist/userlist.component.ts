import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserOutputDto } from '@symbiota2/api-auth';
import { UserPanel } from '../../pages/userlist-page/userpanel-data';

@Component({
  selector: 'symbiota2-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})

export class UserlistComponent implements OnInit {


  @Input() userList: UserOutputDto[];
  @Input() userPanelList: UserPanel[];
  panelOpenState = true;

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

  /*hasPermission(userPanel: UserPanel, targetPermission: String): boolean {
    userPanel.permissions.forEach(role => {
      console.log("Checking targetPermission: ", typeof targetPermission, " against permission: ", typeof role.name);
      if (role.name === targetPermission) {
        console.log("Returning true");
        return true;
      }

    })
    return false;
  } */

}

