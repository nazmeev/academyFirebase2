import { InputType } from '@enum/input-type.enum';
import { Validator } from '@enum/validator.enum';

export class DynamicField {
	field: string;
	label: string;
	value: string;
	inputType: InputType;
	options: string[];
	validators: Validator[];

	constructor(
		field: string,
		inputType: InputType,
		label: string,
		value = '',
		options: string[] = [],
		validators: Validator[] = []
	) {
		this.field = field;
		this.inputType = inputType;
		this.label = label;
		this.value = value;
		this.options = options;
		this.validators = validators;
	}

	static create(
		field: string,
		inputType: InputType,
		label: string,
		value = '',
		options: string[] = [],
		validators: Validator[] = []
	): DynamicField {
		return {
			field,
			inputType,
			label,
			value,
			options,
			validators,
		};
	}
}
