import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GraphService } from '@service/graph.service';
import { MessageService } from '@service/message.service';
import { PanelStyle } from '@enum/style-messages';
import { getLocalStorage, setLocalStorage } from '@utils/localstorage.utils';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	@HostListener('window:resize', ['$event'])
	onWindowResize(event: any) {
		this.width = event.target.innerWidth * 0.9;
		this.height = event.target.innerHeight * 0.54;
	}
	chartType = 'LineChart';

	chartColumnNames = ['Date', 'Leads q-ty'];

	options = {
		hAxis: {
			title: 'Date',
		},
		vAxis: {
			format: '#,###',
			minValue: 0,
			maxValue: 3,
			title: 'Leads quantity',
		},
	};
	chartData;
	width;
	height;
	spin;
	periodDefault = '7';
	period;
	subscription: Subscription;

	constructor(private messageService: MessageService, private graphService: GraphService) {}

	ngOnInit(): void {
		this.setPeriod();
		this.getGraphData(this.period);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	getGraphData(days) {
		this.subscription = this.graphService.getDataList(days).subscribe(data => {
			this.spin = false;
			if (data.length == 0) {
				this.chartData = [['No data to display. Please select a bigger period, or create leads within it.', 0]];
				this.messageService.openSnackBar(
					'No data to display. Please select a bigger period, or create leads within it.',
					'×',
					PanelStyle.error,
					2
				);
			} else {
				let result = {};
				let allDays = this.graphService.createDate(days);
				[...data, ...allDays]
					.sort((a, b) => a - b)
					.forEach(x => (result[this.graphService.dateShorten(x)] = result[this.graphService.dateShorten(x)] + 1 || 0));
				this.chartData = Object.entries(result);
			}
			this.spin = true;
		});
	}

	updateData(event) {
		this.subscription.unsubscribe();
		setLocalStorage('period', event.value);
		this.getGraphData(event.value);
	}

	setPeriod() {
		let periodValue = getLocalStorage('period');
		this.period = periodValue ? periodValue : this.periodDefault;
	}
}
