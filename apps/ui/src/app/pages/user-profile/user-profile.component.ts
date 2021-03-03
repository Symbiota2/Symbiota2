import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AlertService,
    PluginService,
    User,
    UserProfileData,
    UserProfileTab,
    UserRole,
    UserService
} from '@symbiota2/ui-common';
import { ReplaySubject, Subscription } from 'rxjs';
import { PasswordFormValidator } from './password-validator.directive';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('extraTabs', { read: ViewContainerRef })
    public pluginTabContainers: QueryList<ViewContainerRef>;

    public readonly FC_FIRST_NAME = "firstName";
    public readonly FC_LAST_NAME = "lastName";
    public readonly FC_EMAIL = "email";
    public readonly FC_ADDR = "address";
    public readonly FC_CITY = "city";
    public readonly FC_STATE = "state";
    public readonly FC_ZIP = "zip";
    public readonly FC_COUNTRY = "country";
    public readonly FC_TITLE = "title";
    public readonly FC_INSTITUTION = "institution";
    public readonly FC_DEPT = "department";
    public readonly FC_URL = "url";
    public readonly FC_BIO = "biography";
    public readonly FC_PUBLIC = "isPublic";

    public readonly FC_PWD_CURRENT = "currentPassword";
    public readonly FC_PWD = PasswordFormValidator.FIELD_PWD;
    public readonly FC_PWD_CONFIRM = PasswordFormValidator.FIELD_PWD_AGAIN;

    public readonly PWD_ERRORS = PasswordFormValidator.ERRORS;
    public readonly BIO_MAX_LEN = 1500;

    private loginData: User = null;
    private originalProfile: UserProfileData = null;
    private profileSubscription: Subscription;
    private tabsReady = new ReplaySubject(1);

    public pluginTabs: UserProfileTab[] = [];
    public currentTab = 0;

    public profileFormGroup = new FormGroup({
        [this.FC_FIRST_NAME]: new FormControl('', [Validators.required]),
        [this.FC_LAST_NAME]: new FormControl('', [Validators.required]),
        [this.FC_EMAIL]: new FormControl('', [Validators.email]),
        [this.FC_ADDR]: new FormControl(''),
        [this.FC_CITY]: new FormControl(''),
        [this.FC_STATE]: new FormControl(''),
        [this.FC_COUNTRY]: new FormControl(''),
        [this.FC_ZIP]: new FormControl(''),
        [this.FC_TITLE]: new FormControl(''),
        [this.FC_INSTITUTION]: new FormControl(''),
        [this.FC_DEPT]: new FormControl(''),
        [this.FC_URL]: new FormControl(''),
        [this.FC_BIO]: new FormControl('', [Validators.maxLength(this.BIO_MAX_LEN)]),
        [this.FC_PUBLIC]: new FormControl(false)
    });

    public passwordFormGroup = new FormGroup({
        [this.FC_PWD_CURRENT]: new FormControl('', [Validators.required]),
        [this.FC_PWD]: new FormControl('', [Validators.required]),
        [this.FC_PWD_CONFIRM]: new FormControl('', [Validators.required])
    });

    constructor(
        private readonly changeDetector: ChangeDetectorRef,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly userService: UserService,
        private readonly alertService: AlertService,
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        private readonly pluginService: PluginService) { }

    ngOnInit(): void {
        this.currentRoute.queryParamMap.subscribe((params) => {
            if (params.has('tab')) {
                this.currentTab = parseInt(params.get('tab'));
            }
            else {
                this.currentTab = 0;
            }
        });

        this.userService.currentUser.subscribe((loginData) => this.loginData = loginData);
        this.profileSubscription = this.userService.profileData.subscribe((profileData) => {
            if (profileData) {
                this.originalProfile = profileData;
                this.profileFormGroup.patchValue(profileData);
            }
            else {
                this.router.navigate(['']);
                this.alertService.showError('Please log in');
            }
        });

        this.pluginService.userProfileTabs$.pipe(take(1)).subscribe((tabs) => {
            this.pluginTabs = tabs;
            this.tabsReady.next();
            this.tabsReady.complete();
        });
    }

    ngAfterViewInit() {
        this.tabsReady.subscribe(() => {
            this.pluginTabContainers.forEach((ref, idx) => {
                const tab = this.pluginTabs[idx];
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
                ref.createComponent(componentFactory);
            });
            this.changeDetector.detectChanges();
        });
    }

    ngOnDestroy() {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }

    get bioLength() {
        const bioField = this.profileFormGroup.get(this.FC_BIO).value;
        return bioField ? bioField.length : 0;
    }

    get globalRoles(): UserRole[] {
        return this.loginData ? this.loginData.globalRoles : [];
    }

    get collectionRoles(): UserRole[] {
        return this.loginData ? this.loginData.collectionRoles : [];
    }

    get checklistRoles(): UserRole[] {
        return this.loginData ? this.loginData.checklistRoles : [];
    }

    get projectRoles(): UserRole[] {
        return this.loginData ? this.loginData.projectRoles : [];
    }

    onApplyProfile() {
        this.userService.saveProfile(this.profileFormGroup.value).subscribe((newUserData) => {
            if (newUserData) {
                this.originalProfile = newUserData;
            }
        });
    }

    onRevertProfile() {
        this.profileFormGroup.patchValue(this.originalProfile);
    }

    onChangePassword(submitEvent) {
        const oldPassword = this.passwordFormGroup.get(this.FC_PWD_CURRENT).value;
        const newPassword = this.passwordFormGroup.get(this.FC_PWD).value;
        const uid = this.loginData.uid;

        this.userService.changePassword(uid, oldPassword, newPassword).subscribe((err) => {
            // TODO: i18n
            if (err) {
                this.alertService.showError(err);
            }
            else {
                this.alertService.showMessage('Password updated successfully');
            }

            submitEvent.target.reset();
            this.passwordFormGroup.reset();
        });
    }

    onTabChanged(tab: number) {
        this.router.navigate(
            ["."],
            {
                relativeTo: this.currentRoute,
                queryParams: { tab: tab === 0 ? null : tab }
            }
        );
    }
}
