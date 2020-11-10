import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
	static date(control: AbstractControl): ValidationErrors | null {
		const date = control.value;
		const currentDate = new Date();
		const chosenDate = new Date(date);
		return currentDate < chosenDate ? { Date: true } : null;
	}

	static matchValue(controlName: string) {
		return (control: AbstractControl): ValidationErrors | null => {
			return !!control.parent && !!control.parent.value && control.value === control.parent.get(controlName).value
				? null
				: { notSame: true };
		};
	}
}
