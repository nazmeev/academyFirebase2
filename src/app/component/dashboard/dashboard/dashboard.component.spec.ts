import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GraphService } from '../../../service/graph.service';
import { MessageService } from '../../../service/message.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(() => {
		const graphServiceStub = () => ({
			getDataList: days => ({ subscribe: f => f({}) }),
			createDate: days => ({}),
			dateShorten: x => ({}),
		});
		const messageServiceStub = () => ({
			openSnackBar: (string, string1, error, number) => ({}),
		});
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [DashboardComponent],
			providers: [
				{ provide: GraphService, useFactory: graphServiceStub },
				{ provide: MessageService, useFactory: messageServiceStub },
			],
		});
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
	});

	it('can load instance', () => {
		expect(component).toBeTruthy();
	});

	it(`chartType has default value`, () => {
		expect(component.chartType).toEqual(`LineChart`);
	});

	it(`chartColumnNames has default value`, () => {
		expect(component.chartColumnNames).toEqual([`Date`, `Leads q-ty`]);
	});

	it(`periodDefault has default value`, () => {
		expect(component.periodDefault).toEqual(`7`);
	});

	describe('ngOnInit', () => {
		it('makes expected calls', () => {
			let spy = spyOn(component, 'setPeriod');
			let spy2 = spyOn(component, 'getGraphData');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
			expect(spy2).toHaveBeenCalled();
		});
	});
});
