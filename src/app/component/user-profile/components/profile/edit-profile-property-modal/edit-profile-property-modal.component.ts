import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PanelStyle } from '@enum/style-messages';
import { Table } from '@enum/table.enum';
import { first } from 'rxjs/operators';
import { CloudService } from '@service/cloud.service';
import { Subscription } from 'rxjs';
import { UserDataService } from '@service/user/user-data.service';
import { User } from '@model/user';
import { MessageService } from '@service/message.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { EditProfileProperty } from '../edit-profile-property';
import { URL_ROUTES } from '@model/url-routes';
import { Router } from '@angular/router';
import { EditProfile } from '@enum/edit-profile.enum';
import { CustomValidators } from '@validators/custom-validators';

@Component({
	templateUrl: './edit-profile-property-modal.component.html',
	styleUrls: ['./edit-profile-property-modal.component.scss'],
})
export class EditProfilePropertyModalComponent implements OnInit, OnDestroy {
	property: EditProfileProperty;
	form: FormGroup;
	userData: User | null;
	private userDataChangesSub: Subscription;

	constructor(
		@Inject(MAT_DIALOG_DATA) dialogData: { property: EditProfileProperty },
		public dialogRef: MatDialogRef<EditProfilePropertyModalComponent>,
		private fb: FormBuilder,
		private router: Router,
		private cloudService: CloudService,
		private userDataService: UserDataService,
		private messageService: MessageService,
		private firebaseAuth: AngularFireAuth
	) {
		this.property = dialogData.property;
		this.initForm();
	}

	get getDisplayName() {
		return this.form.get('displayName');
	}

	get getCompanyName() {
		return this.form.get('companyName');
	}

	get getEmail() {
		return this.form.get('email');
	}

	get getPassword() {
		return this.form.get('password');
	}

	get getNewPassword() {
		return this.form.get('newPassword');
	}

	ngOnInit(): void {
		this.listenUserDataChanges();
	}

	formError = (controlName: string, errorName: string) => this.form.controls[controlName].hasError(errorName);

	openSuccessSnackBar(message: string) {
		this.messageService.openSnackBar(message, '×', PanelStyle.success);
	}

	openErrorSnackBar(message: string) {
		this.messageService.openSnackBar(message, '×', PanelStyle.error, 2);
	}

	save() {
		switch (this.property) {
			case EditProfile.DISPLAY_NAME:
				this.updateUserData(
					{ displayName: this.getDisplayName.value },
					() => {
						this.openSuccessSnackBar('Success Your name was successfully updated.');
						this.dialogRef.close();
					},
					() => this.openErrorSnackBar('Failed to upload name')
				);
				break;
			case EditProfile.COMPANY_NAME:
				const companyName = this.getCompanyName.value;
				this.updateUserData(
					{ companyName },
					() => {
						this.openSuccessSnackBar('Success Your company name was successfully updated.');
						this.dialogRef.close();
					},
					() => this.openErrorSnackBar('Failed to upload company name')
				);
				break;
			case EditProfile.EMAIL:
				this.firebaseAuth.user.subscribe(user => {
					user
						.verifyBeforeUpdateEmail(this.getEmail.value)
						.then(() => {
							this.dialogRef.close();
							this.router
								.navigate([URL_ROUTES.logout])
								.then(() => this.openSuccessSnackBar('Check your new mail and confirm'));
						})
						.catch(error => this.openErrorSnackBar(error.message));
				});
				break;
			case EditProfile.PASSWORD:
				this.firebaseAuth
					.signInWithEmailAndPassword(this.userData.email, this.getPassword.value)
					.then(result => {
						result.user.updatePassword(this.getNewPassword.value).then(() => {
							this.router.navigate([URL_ROUTES.logout]).then(() => {
								this.openSuccessSnackBar('Password was updated, log in with new credentials');
							});
							this.dialogRef.close();
						});
					})
					.catch(error => this.openErrorSnackBar(error.message));
				break;
		}
	}

	ngOnDestroy() {
		if (this.userDataChangesSub) {
			this.userDataChangesSub.unsubscribe();
		}
	}

	private updateUserData(partialUserData, successCb: () => any, errorCb: () => any) {
		this.cloudService
			.updateData(this.userData.uid, partialUserData, Table.USERS)
			.then(() => {
				this.cloudService
					.getDataById(this.userData.uid, Table.USERS)
					.pipe(first())
					.subscribe(userData => this.userDataService.updateUserData(userData));
				successCb();
			})
			.catch(() => errorCb());
	}

	private listenUserDataChanges() {
		this.userDataChangesSub = this.userDataService.userDataChange$.subscribe(user => {
			this.userData = user;
			this.form.patchValue(this.userData);
		});
	}

	private initForm() {
		switch (this.property) {
			case EditProfile.DISPLAY_NAME:
				this.form = this.fb.group({
					displayName: ['', Validators.required],
				});
				break;
			case EditProfile.COMPANY_NAME:
				this.form = this.fb.group({
					companyName: ['', Validators.maxLength(30)],
				});
				break;
			case EditProfile.EMAIL:
				this.form = this.fb.group({
					email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
				});
				break;
			case EditProfile.PASSWORD:
				this.form = this.fb.group({
					password: ['', [Validators.required]],
					newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
					confirmNewPassword: ['', [Validators.required, CustomValidators.matchValue('newPassword')]],
				});
				break;
		}
	}
}
