import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import {
	LoginComponent,
	LogoutComponent,
	NewPasswordComponent,
	ResetPasswordComponent,
	SignupComponent,
	VerifyAuthActionComponent,
} from './components';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonDirectivesModule } from '@directive/common-directives/common-directives.module';

@NgModule({
	declarations: [
		LoginComponent,
		LogoutComponent,
		SignupComponent,
		ResetPasswordComponent,
		VerifyAuthActionComponent,
		NewPasswordComponent,
	],
	imports: [
		CommonModule,
		UserRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		CommonDirectivesModule,
	],
})
export class UserModule {}
