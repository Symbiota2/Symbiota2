export const CHECKLIST_LIST_ROUTE = 'checklists';
export const CHECKLIST_PROJECT_LIST_ROUTE = 'projects';
export const CHECKLIST_PROJECT_ROUTE = 'project';
export const CHECKLIST_ROUTE = 'checklist';
export const CHECKLIST_REGIONAL_ROUTE = 'checklist/regional';
export const CHECKLIST_PROJECT_ID_ROUTE = CHECKLIST_PROJECT_LIST_ROUTE 
+ '/:projectId';
export const CHECKLIST_PROJECT_ID_CHECKLIST_LIST_ROUTE = CHECKLIST_PROJECT_ID_ROUTE + '/' + CHECKLIST_LIST_ROUTE;

export const CHECKLIST_TEACHING_ROUTE = 'checklist/teaching';
export const CHECKLIST_ID_ROUTE = CHECKLIST_LIST_ROUTE + ':checklistId';
export const CHECKLIST_ADMIN_ROUTE = CHECKLIST_ROUTE + 'checklistadmin/:checklistId';
export const PROFILE_VIEWER_ROUTE = 'profile/viewprofile';
export const CHECKLIST_CREATE_ROUTE = 'checklist/create';