import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DynamicFieldsService } from '../../service/dynamic-fields.service';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';
import { availableFields } from '../../utils/dynamic-fields.utils';
import { isFieldInList } from '../../utils/dynamic-fields.utils';
import { DynamicFieldsComponent } from './dynamic-fields.component';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

describe('DynamicFieldsComponent', () => {
	let component: DynamicFieldsComponent;
	let fixture: ComponentFixture<DynamicFieldsComponent>;
	let fieldsService: DynamicFieldsService;

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
		const messageServiceStub = () => ({
			openSnackBar: (string, string1, error, number) => ({}),
		});
		const routerStub = () => ({ navigate: array => ({}) });
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [DynamicFieldsComponent],
			providers: [
				DynamicFieldsService,
				{ provide: AngularFirestore, useValue: FirestoreStub },
				{ provide: MessageService, useFactory: messageServiceStub },
				{ provide: Router, useFactory: routerStub },
			],
		});
		fieldsService = TestBed.inject(DynamicFieldsService);
		fixture = TestBed.createComponent(DynamicFieldsComponent);
		component = fixture.componentInstance;
	});

	it('can load instance', () => {
		expect(component).toBeTruthy();
	});

	it(`availableFields has default value`, () => {
		expect(component.availableFields).toEqual(availableFields);
	});

	it(`chosenFields has default value`, () => {
		expect(component.chosenFields).toEqual([]);
	});

	it(`isFieldInList has default value`, () => {
		expect(component.isFieldInList).toEqual(isFieldInList);
	});

	describe('ngOnInit', () => {
		it('makes expected calls', () => {
			let spy = spyOn(fieldsService, 'getFields').and.callFake(() => EMPTY);
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
		});

		it('updates var "chosenFields"', () => {
			let spyObj: Observable<any> = of([{ 1: '1' }, { 2: '2' }, { 3: '3' }]);
			spyOn(fieldsService, 'getFields').and.returnValue(spyObj);
			component.ngOnInit();
			expect(component.chosenFields.length).toBe(3);
		});
	});

	describe('saveFields', () => {
		it('makes expected calls', () => {
			const routerStub: Router = fixture.debugElement.injector.get(Router);
			let spy = spyOn(fieldsService, 'saveFields').and.callThrough();
			let spy3 = spyOn(routerStub, 'navigate').and.callThrough();
			component.saveFields();
			expect(spy).toHaveBeenCalled();
			expect(spy3).toHaveBeenCalled();
		});
	});

	describe('addField', () => {
		it('updates var', () => {
			component.addField({ 1: '1' });
			expect(component.chosenFields.length).toBe(1);
		});
	});
});
