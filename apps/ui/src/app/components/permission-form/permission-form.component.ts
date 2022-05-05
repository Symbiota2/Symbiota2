import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoleOutputDto } from '@symbiota2/api-auth';
import { UserRole, UserService } from '@symbiota2/ui-common';
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


  constructor(private fb: FormBuilder,
    private readonly userService: UserService,) { }

  ngOnInit(): void {
    this.permsForm = this.fb.group({
      SuperAdmin: this.userPanel.hasPermission(this.SUPER_ADMIN),
      Taxonomy: this.userPanel.hasPermission(this.TAXON_EDITOR),
      TaxonProfile: this.userPanel.hasPermission(this.TAXON_PROFILE_EDITOR),
      KeyAdmin: this.userPanel.hasPermission(this.ROLE_KEY_ADMIN),
      KeyEditor: this.userPanel.hasPermission(this.ROLE_KEY_EDITOR),
      RareSppAdmin: this.userPanel.hasPermission(this.RARE_SPECIES_ADMIN),
      RareSppReader: this.userPanel.hasPermission(this.RARE_SPECIES_READER),
    });
    this.permsForm.markAsPristine();
  }



  onSubmit(): void {
    let oldPermissions: RoleOutputDto[] = this.userPanel.permissions;
    var formData = this.permsForm.getRawValue();
    var selectedPermissions = [];
    var permissionNamesToRemove = [];
    var permissionsToRemove = [];

    for (var permissionName in formData) {
      if (formData[permissionName]) {
        selectedPermissions.push(permissionName);
      }
    }

    for (var index in oldPermissions) {
      if (!selectedPermissions.includes(oldPermissions[index].name)) {
        permissionNamesToRemove.push(oldPermissions[index].name);
        permissionsToRemove.push(oldPermissions[index]);
      }
    }

    alert("Selected permissions for user: " + this.userPanel.user.username + ": " + selectedPermissions + "\n"
      + "Removing permissions: " + permissionNamesToRemove);
    console.log(permissionsToRemove);

    //Add permissions

    //Remove permissions
    for (var index in permissionsToRemove) {
      this.userService.deleteRole(this.userPanel.user.uid, permissionsToRemove[index].id);
    }

  }
}
