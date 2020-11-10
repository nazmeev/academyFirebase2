import { Component, OnInit } from '@angular/core';
import { DynamicField } from '@model/dynamic-field';
import { DynamicFieldsService } from '@service/dynamic-fields.service';
import { availableFields, findFieldIndex, isFieldInList } from '@utils/dynamic-fields.utils';
import { MessageService } from '@service/message.service';
import { PanelStyle } from '@enum/style-messages';
import { Router } from '@angular/router';
import { URL_ROUTES } from '@model/url-routes';

@Component({
	selector: 'app-dynamic-fields',
	templateUrl: './dynamic-fields.component.html',
	styleUrls: ['./dynamic-fields.component.scss'],
})
export class DynamicFieldsComponent implements OnInit {
	availableFields: DynamicField[] = availableFields;
	chosenFields: DynamicField[] = [];

	constructor(private fieldsService: DynamicFieldsService, private message: MessageService, private router: Router) {}

	isFieldInList = isFieldInList;

	ngOnInit(): void {
		this.fieldsService.getFields().subscribe(fields => (this.chosenFields = fields));
	}

	addField(field) {
		const index = findFieldIndex(this.chosenFields, field);
		if (index === -1) {
			this.chosenFields.push(field);
		}
	}

	removeField(field) {
		const index = findFieldIndex(this.chosenFields, field);
		if (field.field.includes('date') || field.field.includes('email')) {
			this.message.openSnackBar('Your table must contain 2 columns: "Email" and "Date"', 'Ok', PanelStyle.error, 2);
		} else if (index !== -1) {
			this.chosenFields.splice(index, 1);
		}
	}

	saveFields() {
		this.fieldsService.saveFields(this.chosenFields).then(() => {
			this.message.openSnackBar('Fields saved successfully', 'Ok', PanelStyle.success);
		});
		this.router.navigate([URL_ROUTES.mainpage]);
	}
}
