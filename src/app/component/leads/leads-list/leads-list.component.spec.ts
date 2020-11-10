import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CloudService } from '../../../service/cloud.service';
import { MessageService } from '../../../service/message.service';
import { FormBuilder } from '@angular/forms';
import { UserDataService } from '../../../service/user/user-data.service';
import { DatePipe } from '@angular/common';
import { DynamicFieldsService } from '../../../service/dynamic-fields.service';
import { LeadsListComponent } from './leads-list.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';

describe('LeadsListComponent', () => {
	let component: LeadsListComponent;
	let fixture: ComponentFixture<LeadsListComponent>;
	let dataService: CloudService;
	let fieldsService: DynamicFieldsService;
	let dataFromStorage;

	beforeEach(() => {
		const FirestoreStub = {
			collection: (name: string) => ({
				doc: (_id: string) => ({
					valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
					set: (_d: any) => new Promise((resolve, _reject) => resolve()),
					get: (_d: any) => new Promise((resolve, _reject) => resolve()),
					update: (_d: any) => new Promise((resolve, _reject) => resolve()),
					delete: (_d: any) => new Promise((resolve, _reject) => resolve()),
				}),
			}),
		};
		const elementRefStub = () => ({});
		const messageServiceStub = () => ({
			openSnackBar: (string, string1, error, number) => ({}),
		});
		const formBuilderStub = () => ({
			group: object => ({}),
			control: (arg, arg1) => ({}),
		});
		const userDataServiceStub = () => ({
			getParsedUserData: () => dataFromStorage,
		});
		const datePipeStub = () => ({
			transform: () => ({}),
		});
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [LeadsListComponent],
			providers: [
				{ provide: ElementRef, useFactory: elementRefStub },
				{ provide: AngularFirestore, useValue: FirestoreStub },
				{ provide: MessageService, useFactory: messageServiceStub },
				{ provide: FormBuilder, useFactory: formBuilderStub },
				{ provide: UserDataService, useFactory: userDataServiceStub },
				{ provide: DatePipe, useFactory: datePipeStub },
				CloudService,
				DynamicFieldsService,
			],
		});
		dataFromStorage = {
			uid: 'test',
			displayName: 'testname',
			email: 'testemail',
			photoURL: 'testurl',
		};
		dataService = TestBed.inject(CloudService);
		fieldsService = TestBed.inject(DynamicFieldsService);
		fixture = TestBed.createComponent(LeadsListComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it(`isLoadingResults has default value`, () => {
		expect(component.isLoadingResults).toEqual(true);
	});

	it(`pageSizeOptions has default value`, () => {
		expect(component.pageSizeOptions).toEqual([10, 25, 50]);
	});

	it(`displayedColumns has default value`, () => {
		expect(component.displayedColumns).toEqual([`select`, `edit-btn`]);
	});

	it(`userFields has default value`, () => {
		expect(component.userFields).toEqual([]);
	});

	it(`userLeads has default value`, () => {
		expect(component.userLeads).toEqual([]);
	});

	it(`dateReg has default value`, () => {
		expect(component.dateReg).toEqual(/^\d{4}\-\d{1,2}\-\d{1,2}$/);
	});

	it('userId has expected value', () => {
		const userDataServiceStub: UserDataService = fixture.debugElement.injector.get(UserDataService);
		spyOn(userDataServiceStub, 'getParsedUserData').and.callThrough();
		component.userId;
		expect(component.userId).toEqual('test');
	});

	describe('ngOnInit', () => {
		it('makes expected calls when ngOnInit()', () => {
			let spyGetFieldsArray = spyOn(component, 'getFieldsArray');
			let spyInitFormFields = spyOn(component, 'initFormFields');
			let spyGetColumns = spyOn(component, 'getColumns');
			let spyDisplayLeads = spyOn(component, 'displayLeads');
			component.ngOnInit();
			expect(spyGetFieldsArray).toHaveBeenCalled();
			expect(spyInitFormFields).toHaveBeenCalled();
			expect(spyGetColumns).toHaveBeenCalled();
			expect(spyDisplayLeads).toHaveBeenCalled();
		});
	});

	describe('initFormFields', () => {
		it('makes expected calls', () => {
			const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
			spyOn(formBuilderStub, 'control').and.callThrough();
			spyOn(formBuilderStub, 'group').and.callThrough();
			component.initFormFields();
			expect(formBuilderStub.control).toHaveBeenCalled();
			expect(formBuilderStub.group).toHaveBeenCalled();
		});
	});

	describe('getFieldsArray', () => {
		it('calls dataService.getDocumentData() when getFieldsArray()', () => {
			let spy = spyOn(dataService, 'getDocumentData').and.callFake(() => {
				return EMPTY;
			});
			component.getFieldsArray();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('initFormFields', () => {
		it('makes expected calls', () => {
			const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
			spyOn(formBuilderStub, 'control').and.callThrough();
			spyOn(formBuilderStub, 'group').and.callThrough();
			component.initFormFields();
			expect(formBuilderStub.control).toHaveBeenCalled();
			expect(formBuilderStub.group).toHaveBeenCalled();
		});
	});

	describe('getColumns()', () => {
		it('call dataService.getDataById() when getColumns()', () => {
			let spy = spyOn(dataService, 'getDataById').and.callFake(() => {
				return EMPTY;
			});
			component.getColumns();
			expect(spy).toHaveBeenCalled();
		});

		it('updates userFields after getFieldsArray()', () => {
			const spy: Observable<any> = of({ fields: ['1', '2', '3'] });
			spyOn(dataService, 'getDataById').and.returnValue(spy);
			component.getColumns();
			expect(component.displayedColumns.length).toBe(5);
		});

		it('updates isLoadingResults after getFieldsArray()', () => {
			const spy: Observable<any> = of({ fields: ['1', '2', '3'] });
			spyOn(dataService, 'getDataById').and.returnValue(spy);
			component.getColumns();
			expect(component.isLoadingResults).toBeFalse();
		});
	});

	describe('delLeads', () => {
		it('makes expected calls', () => {
			const messageServiceStub: MessageService = fixture.debugElement.injector.get(MessageService);
			let spy = spyOn(messageServiceStub, 'openSnackBar');
			component.delLeads();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('displayLeads', () => {
		it('updates variables of component', () => {
			const spyObj: Observable<any> = of({ lidData: [{ 1: '1' }, { 2: '2' }, { 3: '3' }] });
			spyOn(dataService, 'getDataById').and.returnValue(spyObj);
			component.displayLeads();
			expect(component.totalLeadsNum).toEqual(3);
			expect(component.userLeads.length).toEqual(3);
		});

		it('makes expected calls', () => {
			let spy = spyOn(dataService, 'getDataById').and.callFake(() => EMPTY);
			component.displayLeads();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('masterToggle', () => {
		it('makes expected calls', () => {
			spyOn(component, 'isAllSelected').and.callThrough();
			component.masterToggle();
			expect(component.isAllSelected).toHaveBeenCalled();
		});
	});
});
