import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PanelStyle } from '@enum/style-messages';
import { URL_ROUTES } from '@model/url-routes';
import { MessageService } from '@service/message.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../../../../../assets/scss/user.module.scss'],
})
export class ResetPasswordComponent {
	resetPasswordForm: FormGroup;
	buttonDisabled: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private messageService: MessageService,
		private router: Router,
		private firebaseAuth: AngularFireAuth
	) {
		this.resetPasswordForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
		});
	}

	get email() {
		return this.resetPasswordForm.get('email');
	}

	resetPassword() {
		this.buttonDisabled = true;
		const email = this.resetPasswordForm.value.email;

		this.firebaseAuth
			.sendPasswordResetEmail(email)
			.then(() => {
				this.router
					.navigate([URL_ROUTES.mainpage])
					.then(() =>
						this.messageService.openSnackBar(
							'A password reset link has been sent to your email address',
							'×',
							PanelStyle.notice,
							2
						)
					);
			})
			.catch(error => {
				this.messageService.openSnackBar(error.message, '×', PanelStyle.error, 2);
				this.buttonDisabled = false;
			});
	}
}
