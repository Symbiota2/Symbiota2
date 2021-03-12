// Can't export it because it'll break the typeorm entity loader
export enum UserRoleName {
    ROLE_SUPER_ADMIN = 'SuperAdmin',
    ROLE_CHECKLIST_ADMIN = 'ClAdmin',
    ROLE_COLLECTION_ADMIN = 'CollAdmin',
    ROLE_COLLECTION_EDITOR = 'CollEditor',
    ROLE_DATASET_ADMIN = 'DatasetAdmin',
    ROLE_DATASET_EDITOR = 'DatasetEditor',
    ROLE_KEY_ADMIN = 'KeyAdmin',
    ROLE_KEY_EDITOR = 'KeyEditor',
    ROLE_PROJECT_ADMIN = 'ProjectAdmin',
    ROLE_RARE_SPECIES_ADMIN = 'RareSppAdmin',
    ROLE_RARE_SPECIES_READER = 'RareSppReader',
    ROLE_TAXON_EDITOR = 'TaxonEditor',
    ROLE_TAXON_PROFILE = 'TaxonProfile'
}
