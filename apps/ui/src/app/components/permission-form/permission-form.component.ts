import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoleOutputDto } from '@symbiota2/api-auth';
import { ApiUserRoleName } from '@symbiota2/data-access';
import { UserService } from '@symbiota2/ui-common';
import { UserRoleInputDto } from 'libs/ui-common/src/lib/user/dto/role-input-dto.class';
import { UserPanel } from '../../pages/userlist-page/userpanel-data';

@Component({
  selector: 'symbiota2-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {
  @Input() userPanel: UserPanel;

  //stuff = this.CHECKLIST_ADMIN;

  //Role names ripped from the this enum to use here on the ui.
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

  apiRoleNames = {
    "SuperAdmin": ApiUserRoleName.SUPER_ADMIN,
    "Taxonomy": ApiUserRoleName.TAXON_EDITOR,
    "TaxonProfile": ApiUserRoleName.TAXON_PROFILE_EDITOR,
    "KeyAdmin": ApiUserRoleName.ROLE_KEY_ADMIN,
    "KeyEditor": ApiUserRoleName.ROLE_KEY_EDITOR,
    "RareSppAdmin": ApiUserRoleName.RARE_SPECIES_ADMIN,
    "RareSppReader": ApiUserRoleName.RARE_SPECIES_READER
  }

  permsForm: FormGroup;


  constructor(private fb: FormBuilder,
    private readonly userService: UserService,) { }

  ngOnInit(): void {
    this.permsForm = this.fb.group({
      SuperAdmin: this.userPanel.hasPermission(ApiUserRoleName.SUPER_ADMIN),
      Taxonomy: this.userPanel.hasPermission(ApiUserRoleName.TAXON_EDITOR),
      TaxonProfile: this.userPanel.hasPermission(ApiUserRoleName.TAXON_PROFILE_EDITOR),
      KeyAdmin: this.userPanel.hasPermission(ApiUserRoleName.ROLE_KEY_ADMIN),
      KeyEditor: this.userPanel.hasPermission(ApiUserRoleName.ROLE_KEY_EDITOR),
      RareSppAdmin: this.userPanel.hasPermission(ApiUserRoleName.RARE_SPECIES_ADMIN),
      RareSppReader: this.userPanel.hasPermission(ApiUserRoleName.RARE_SPECIES_READER),
    });
    this.permsForm.markAsPristine();
  }



  onSubmit(): void {
    let oldPermissions: RoleOutputDto[] = this.userPanel.permissions;
    var formData = this.permsForm.getRawValue();
    var selectedPermissionNames = [];
    var permissionNamesToRemove = [];
    var permissionsToRemove = [];
    var permissionNamesToAdd = [];


    //Get the permissions marked as true.
    for (var permissionName in formData) {
      if (formData[permissionName]) {
        selectedPermissionNames.push(permissionName);
      }
    }

    //Initialize as all selected need to be added
    permissionNamesToAdd = Object.assign([], selectedPermissionNames);
    //Get permissions that need to be added
    for (var index in oldPermissions) {
      if (permissionNamesToAdd.includes(oldPermissions[index].name)) {
        permissionNamesToAdd = permissionNamesToAdd.filter(item => item !== oldPermissions[index].name);
      }

    }

    //Get permissions to remove
    for (var index in oldPermissions) {
      if (!selectedPermissionNames.includes(oldPermissions[index].name)) {
        permissionNamesToRemove.push(oldPermissions[index].name);
        permissionsToRemove.push(oldPermissions[index]);
      }
    }

    alert("Selected permissions for user: " + this.userPanel.user.username + ": " + selectedPermissionNames + "\n"
      + "Adding permissions: " + permissionNamesToAdd + "\nRemoving permissions: " + permissionNamesToRemove);
    console.log(permissionsToRemove);

    //Add permissions
    for (var permissionName in permissionNamesToAdd) {
      //Make role input dto to send to user_service
      const newRole = new UserRoleInputDto(this.apiRoleNames[permissionName]);
    }

    //Remove permissions
    for (var index in permissionsToRemove) {
      this.userService.deleteRole(this.userPanel.user.uid, permissionsToRemove[index].id);
    }

  }
}
