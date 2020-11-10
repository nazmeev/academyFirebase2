import { DynamicField } from '@model/dynamic-field';
import { InputType } from '@enum/input-type.enum';
import { Validator } from '@enum/validator.enum';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';

export const availableFields: DynamicField[] = [
	DynamicField.create('date', InputType.DATE, 'Date', '', [], [Validator.REQUIRED, Validator.DATE]),
	DynamicField.create('email', InputType.INPUT, 'Email', '', [], [Validator.REQUIRED, Validator.EMAIL]),
	DynamicField.create('firstName', InputType.INPUT, 'First Name', '', [], []),
	DynamicField.create('lastName', InputType.INPUT, 'Last Name', '', [], []),
	DynamicField.create('companyName', InputType.INPUT, 'Company Name', '', [], []),
	DynamicField.create('companySize', InputType.NUMBER_INPUT, 'Company size', '', [], [Validator.MIN]),
	DynamicField.create('website', InputType.INPUT, 'Website', '', [], [Validator.URL]),
	DynamicField.create(
		'status',
		InputType.SELECT,
		'Status',
		'',
		['new', 'In progress', 'lost opportunity', 'contact later', 'active client', 'past client', 'not interested'],
		[]
	),
	DynamicField.create('country', InputType.INPUT, 'Country'),
	DynamicField.create('industry', InputType.INPUT, 'Industry'),
	DynamicField.create('note', InputType.TEXTAREA, 'Note'),
];

export const findFieldIndex = (list: DynamicField[], field) => list.findIndex(item => item.field === field.field);

export const isFieldInList = (list: DynamicField[], field) => findFieldIndex(list, field) !== -1;

export const getValidatorByName = (validatorName: string) => {
	switch (validatorName) {
		case Validator.REQUIRED:
			return Validators.required;
		case Validator.EMAIL:
			return Validators.email;
		case Validator.URL:
			return Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
		case Validator.MIN:
			return Validators.min(1);
		case Validator.DATE:
			return CustomValidators.date;
	}
};

export const generateNumberId = () => Math.ceil(Math.random() * 10000 * 43);
