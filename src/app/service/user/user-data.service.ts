import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@model/user';
import { getLocalStorage, setLocalStorage } from '@utils/localstorage.utils';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserDataService {
	private userDataChangedSubject = new BehaviorSubject(this.getParsedUserData());
	userDataChange$ = this.userDataChangedSubject.asObservable();

	constructor() {}

	get getDefaultUserImage() {
		return environment.defaultPhotoURL;
	}

	updateUserData(userData: User) {
		this.saveUserToStorage(userData);
		this.userDataChangedSubject.next(userData);
	}

	updateUserProperty(property: string, value: any) {
		const user = this.getParsedUserData();
		if (user && property in user) {
			user[property] = value;
			this.updateUserData(user);
		}
	}

	getParsedUserData(): User | null {
		const userData = getLocalStorage('user');
		return userData ? JSON.parse(userData) : null;
	}

	saveUserToStorage(userData: User) {
		if (userData) {
			setLocalStorage('user', JSON.stringify(userData));
		}
	}
}
