import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { URL_ROUTES } from '@model/url-routes';
import { removeLocalStorage } from '@utils/localstorage.utils';

@Component({
	templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
	constructor(private router: Router, private firebaseAuth: AngularFireAuth) {}

	ngOnInit(): void {
		this.firebaseAuth.signOut().then(() => {
			removeLocalStorage('user');
			removeLocalStorage('period');
			this.router.navigate([URL_ROUTES.login]);
		});
	}
}
