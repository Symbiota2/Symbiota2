import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiClientModule } from '../api-client';


@NgModule({
    imports: [
        ApiClientModule,
        CommonModule,
        FlexModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatTabsModule,
        ReactiveFormsModule,
    ]
})
export class UserModule { }
