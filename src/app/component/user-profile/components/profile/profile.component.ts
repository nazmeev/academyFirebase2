import { Component, OnDestroy } from '@angular/core';
import { CloudService } from '@service/cloud.service';
import { MessageService } from '@service/message.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { PanelStyle } from '@enum/style-messages';
import { UserDataService } from '@service/user/user-data.service';
import { User } from '@model/user';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Table } from '@enum/table.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProfilePropertyModalComponent } from './edit-profile-property-modal/edit-profile-property-modal.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
	userData: User | null;
	showSecurityOptions = false;
	private userDataChangesSub: Subscription;

	constructor(
		private cloudService: CloudService,
		private messageService: MessageService,
		private userDataService: UserDataService,
		private router: Router,
		private route: ActivatedRoute,
		private firebaseAuth: AngularFireAuth,
		private dialog: MatDialog
	) {
		this.listenUserDataChanges();
	}

	openImageModal(): void {
		this.dialog.open(ImageUploaderComponent, {
			width: '450px',
			maxWidth: '100vw',
			panelClass: 'image-uploader-dialog',
		});
	}

	setDefaultImg() {
		const photoURL = this.userDataService.getDefaultUserImage;
		this.updateUserData(
			{ photoURL },
			() => this.messageService.openSnackBar('Success Your photo was successfully updated.', '×', PanelStyle.success),
			() => this.messageService.openSnackBar('Failed to upload photo', '×', PanelStyle.error, 2)
		);
	}

	ngOnDestroy() {
		if (this.userDataChangesSub) {
			this.userDataChangesSub.unsubscribe();
		}
	}

	openEditModal(property) {
		this.dialog.open(EditProfilePropertyModalComponent, {
			data: { property },
			width: '320px',
			panelClass: 'edit-profile-dialog',
		});
	}

	private listenUserDataChanges() {
		this.userDataChangesSub = this.userDataService.userDataChange$.subscribe(user => {
			this.userData = user;
			this.firebaseAuth.fetchSignInMethodsForEmail(this.userData.email).then(result => {
				this.showSecurityOptions = result.indexOf('password') !== -1;
			});
		});
	}

	private updateUserData(partialUserData, successCb: () => any, errorCb = () => {}) {
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
}
