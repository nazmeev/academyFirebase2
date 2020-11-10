import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelStyle } from '@enum/style-messages';
import { URL_ROUTES } from '@model/url-routes';
import { MessageService } from '@service/message.service';
import { CustomValidators } from '@validators/custom-validators';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Component({
	templateUrl: './new-password.component.html',
	styleUrls: ['../../../../../assets/scss/user.module.scss'],
})
export class NewPasswordComponent {
	newPasswordForm: FormGroup;
	buttonDisabled = false;
	verifyCode: string;
	dirtyStateMatcher = new ShowOnDirtyErrorStateMatcher();

	constructor(
		private formBuilder: FormBuilder,
		private messageService: MessageService,
		private router: Router,
		private activateRoute: ActivatedRoute,
		private firebaseAuth: AngularFireAuth
	) {
		this.checkCodeAccess();
		this.newPasswordForm = this.formBuilder.group({
			password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
			confirmPassword: ['', [Validators.required, CustomValidators.matchValue('password')]],
		});
	}

	get password() {
		return this.newPasswordForm.get('password');
	}
	get confirmPassword() {
		return this.newPasswordForm.get('confirmPassword');
	}
	

	newPassword() {
		this.buttonDisabled = true;
		const password = this.newPasswordForm.value.password;

		this.firebaseAuth
			.confirmPasswordReset(this.verifyCode, password)
			.then(() => {
				this.router
					.navigate([URL_ROUTES.login])
					.then(() => this.messageService.openSnackBar('You can sign in now', '×', PanelStyle.success));
			})
			.catch(error => {
				this.messageService.openSnackBar(error.message, '×', PanelStyle.error, 2);
				this.buttonDisabled = false;
			});
	}

	checkCodeAccess() {
		this.verifyCode = this.activateRoute.snapshot.queryParams.code;
		if (!this.verifyCode) {
			this.router
				.navigate([URL_ROUTES.resetpassword])
				.then(() =>
					this.messageService.openSnackBar(
						'Verification code error. Try reset password again',
						'×',
						PanelStyle.error,
						2
					)
				);
		}
	}
}
