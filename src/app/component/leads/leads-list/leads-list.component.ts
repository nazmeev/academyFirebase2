import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CloudService } from '@service/cloud.service';
import { LeadData } from '@model/lead.interface';
import { MessageService } from '@service/message.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PanelStyle } from '@enum/style-messages';
import { DynamicField } from '@model/dynamic-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { generateNumberId, getValidatorByName } from '@utils/dynamic-fields.utils';
import { Table } from '@enum/table.enum';
import { MatSidenav } from '@angular/material/sidenav';
import { UserDataService } from '@service/user/user-data.service';
import { DatePipe } from '@angular/common';
import { DynamicFieldsService } from '@service/dynamic-fields.service';

@Component({
	selector: 'app-leads-list',
	templateUrl: './leads-list.component.html',
	styleUrls: ['./leads-list.component.scss'],
})
export class LeadsListComponent implements OnInit {
	selection = new SelectionModel<LeadData>(true, []);
	dataSource: MatTableDataSource<LeadData>;
	totalLeadsNum: number;
	isLoadingResults = true;
	userId: string;
	pageSizeOptions: number[] = [10, 25, 50];
	displayedColumns: string[] = ['select', 'edit-btn'];
	userData: any;
	userFields: DynamicField[] = [];
	addForm: FormGroup;
	userLeads: LeadData[] = [];
	dateReg = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

	@ViewChild('sidenav') sidenav: MatSidenav;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private dataService: CloudService,
		private message: MessageService,
		private userService: UserDataService,
		private fieldsService: DynamicFieldsService,
		private fb: FormBuilder,
		private el: ElementRef,
		private datePipe: DatePipe
	) {
		this.userId = this.userService.getParsedUserData().uid;
		this.dataSource = new MatTableDataSource([]);
		this.addForm = this.fb.group({});
	}

	get firstName() {
		return this.addForm.get('firstName');
	}

	get lastName() {
		return this.addForm.get('lastName');
	}

	get email() {
		return this.addForm.get('email');
	}

	get website() {
		return this.addForm.get('website');
	}

	ngOnInit() {
		this.getFieldsArray();
		this.initFormFields();
		this.getColumns();
		this.displayLeads();
	}

	initFormFields() {
		const group = {};
		this.userFields.forEach(f => {
			group[f.field] = this.fb.control(null, f.validators.map(getValidatorByName));
		});
		const list = {
			id: this.fb.control(null),
			...group,
		};
		this.addForm = this.fb.group(list);
	}

	getFieldsArray = (): any => {
		return this.dataService
			.getDocumentData(this.userId, Table.USERS)
			.pipe(map(item => item.data().fields))
			.subscribe(data => {
				this.userFields = data;
				this.initFormFields();
			});
	};

	createOrEditLead = (chosenLead): void => {
		if (this.addForm.valid) {
			if (chosenLead.id) {
				if (chosenLead.date.match(this.dateReg)) {
					chosenLead.date = Date.parse(chosenLead.date);
				}
				const index = this.userLeads.findIndex((f: any) => f.id === chosenLead.id);
				this.userLeads[index] = chosenLead;
				const data = { lidData: this.userLeads };
				this.dataService.setDocDataByID(this.userId, data, Table.LEADS);
				this.clearForm();
			} else {
				if (chosenLead.date) {
					chosenLead.date = Date.parse(chosenLead.date);
				}
				const leadWithId = {
					...chosenLead,
					id: generateNumberId(),
				};
				const firstLead = {
					lidData: [leadWithId],
				};
				this.dataService.getDocumentData(this.userId, Table.LEADS).subscribe(doc => {
					if (doc.exists) {
						this.dataService.updateData(
							this.userId,
							{ lidData: this.dataService.addArrayItem(leadWithId) },
							Table.LEADS
						);
					} else {
						this.dataService.setDocDataByID(this.userId, firstLead, Table.LEADS);
					}
				});
			}
			this.selection.clear();
			this.sidenav.close();
		}
	};

	clearForm = () => {
		this.addForm.reset();
		const inputs = this.el.nativeElement.querySelectorAll('.mat-form-field-invalid');
		for (const item of inputs) {
			item.classList.remove('mat-form-field-invalid');
		}
	};

	getColumns = () => {
		this.dataService
			.getDataById(this.userId, Table.USERS)
			.pipe(take(1))
			.subscribe(userData => {
				userData.fields.forEach(f => this.displayedColumns.push(f.field));
				this.isLoadingResults = false;
			});
	};

	delLeads = () => {
		const listToDel: object[] = this.selection.selected.map(e => e);
		for (const el of listToDel) {
			this.dataService.updateData(this.userId, { lidData: this.dataService.deleteArrayItem(el) }, Table.LEADS);
		}
		const text = listToDel.length === 1 ? 'Lead was successfully deleted' : 'Leads were successfully deleted';
		this.message.openSnackBar(text, 'x', PanelStyle.success);
		this.selection.clear();
	};

	displayLeads = () => {
		this.dataService.getDataById(this.userId, Table.LEADS).subscribe(arr => {
			this.userLeads = arr ? arr.lidData : [];
			this.dataSource = new MatTableDataSource<any>(this.userLeads);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			this.totalLeadsNum = this.dataSource.filteredData.length;
		});
	};

	applyFilter(event: Event) {
		const filterValue: string = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	isAllSelected() {
		const numSelected: number = this.selection.selected.length;
		const numRows: number = this.dataSource.data.length;
		return numSelected == numRows;
	}

	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousIndex && event.currentIndex > 1) {
			moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
			moveItemInArray(this.userFields, event.previousIndex - 2, event.currentIndex - 2);
			this.fieldsService.saveFields(this.userFields);
		} else {
			this.message.openSnackBar('You cannot move "Select" and "Edit" columns', 'x', PanelStyle.error, 2);
		}
	}

	openEditSidenav = (row): void => {
		row.date = this.datePipe.transform(row.date, 'yyyy-MM-dd');
		this.sidenav.toggle();
		this.clearForm();
		this.addForm.patchValue(row);
	};

	openAddSidenav = (): void => {
		this.sidenav.toggle();
		this.clearForm();
	};
}
