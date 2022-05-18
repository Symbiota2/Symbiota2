// import { Injectable } from '@angular/core';
// import { 
//     CanActivate, 
//     CanLoad,
//     Route, 
//     UrlSegment, 
//     ActivatedRouteSnapshot, 
//     RouterStateSnapshot,
//     UrlTree,
//     Router
// } from '@angular/router';
// import { UserService } from '@symbiota2/ui-common';
// import { Observable } from 'rxjs';
// import { filter, take, tap } from 'rxjs/operators';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//     currentUser$ = this.userService.currentUser;
//     userID: number = null;
//     userCanEdit = false;

//     constructor(private userService: UserService,
//         private router: Router) {}

//     canActivate(
//         route: ActivatedRouteSnapshot, 
//         state: RouterStateSnapshot
//     ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

//         this.userService.currentUser
//             .pipe(
//                 filter((user) => user !== null),
//                 take(1)
//             )
//             .subscribe((user) => {
//                 this.userID = user.uid;
//                 this.userCanEdit = user.canEditChecklist(user.uid);
//                 this.router.navigateByUrl('/')
//             })

//             return this.userCanEdit;
    
//     }
// }