import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { messageType } from '../types/type-messages';

@Injectable({ providedIn: 'root' })
export class MessageService {
	private duration: number = 2000;
	private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
	private verticalPosition: MatSnackBarVerticalPosition = 'top';

	constructor(private _snackBar: MatSnackBar) {}

	openSnackBar(message: string, action: string, panelClass: messageType, durationMore: number = 1) {
		let options = {
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass: [panelClass],
			duration: this.duration * durationMore,
		};

		this._snackBar.open(message, action, options);
	}
}
