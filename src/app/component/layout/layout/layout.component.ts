import { Component, OnInit } from '@angular/core';
import { UserDataService } from '@service/user/user-data.service';
import { User } from '@model/user';
import { URL_ROUTES } from '@model/url-routes';
import { Router } from '@angular/router';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
	userData: User | undefined = new User('', '', '', '', '');
	activePerson = false;
	constructor(private userDataService: UserDataService, private router: Router) {}

	ngOnInit(): void {
		this.userDataService.userDataChange$.subscribe(user => {
			this.userData = user;
			if (!this.userData) {
				this.router.navigate([URL_ROUTES.logout]);
			}
		});
	}

	focusable() {
		this.activePerson = !this.activePerson;
	}
}
