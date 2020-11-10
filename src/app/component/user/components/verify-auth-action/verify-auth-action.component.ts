import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelStyle } from '@enum/style-messages';
import { URL_ROUTES } from '@model/url-routes';
import { MessageService } from '@service/message.service';

@Component({
	template: 'verifying code...',
})
export class VerifyAuthActionComponent {
	constructor(
		private messageService: MessageService,
		private router: Router,
		private activateRoute: ActivatedRoute,
		private firebaseAuth: AngularFireAuth
	) {
		this.verifyAction();
	}

	private verifyPassword(code: string, mode: string) {
		this.firebaseAuth
			.verifyPasswordResetCode(code)
			.then(() => this.router.navigate([URL_ROUTES.newpassword], { queryParams: { code, mode } }))
			.then(() => this.messageService.openSnackBar('Code verified. Enter new password', '×', PanelStyle.success))
			.catch(error =>
				this.router
					.navigate([URL_ROUTES.resetpassword])
					.then(() => this.messageService.openSnackBar(error.message, '×', PanelStyle.error, 2))
			);
	}

	private verifyCodeAndLogout(code, successMessage: string) {
		this.firebaseAuth
			.checkActionCode(code)
			.then(() => this.firebaseAuth.applyActionCode(code))
			.then(() => this.router.navigate([URL_ROUTES.logout]))
			.then(() => this.messageService.openSnackBar(successMessage, '×', PanelStyle.success))
			.catch(error => this.messageService.openSnackBar(error.message, '×', PanelStyle.error, 2));
	}

	private verifyAction() {
		const { oobCode, mode } = this.activateRoute.snapshot.queryParams;
		switch (mode) {
			case 'resetPassword':
				this.verifyPassword(oobCode, mode);
				break;
			case 'verifyAndChangeEmail':
				this.verifyCodeAndLogout(oobCode, 'Use your new email to log in');
				break;
			case 'recoverEmail':
				this.verifyCodeAndLogout(oobCode, 'Email recovery success');
				break;
			default:
				this.messageService.openSnackBar('Wrong action', '×', PanelStyle.error, 2);
		}
	}
}
