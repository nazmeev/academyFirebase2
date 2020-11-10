import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CloudService } from './cloud.service';
import { UserDataService } from './user/user-data.service';
import { Table } from '@enum/table.enum';

@Injectable({ providedIn: 'root' })
@Injectable({ providedIn: 'root' })
export class GraphService {
	userId;
	constructor(private cloudService: CloudService, private userDataService: UserDataService) {
		this.userId = this.userDataService.getParsedUserData().uid;
	}

	convertDate(item) {
		let date = new Date();
		let pureCurrentDate = this.currentDate();
		let leadDate = new Date(+item.date);
		let pureLeadDate = new Date(leadDate.getFullYear(), leadDate.getMonth(), leadDate.getDate()).getTime();
		return (pureCurrentDate - pureLeadDate) / 1000 / 60 / 60 / 24;
	}
	currentDate() {
		let date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	}
	dateShorten(date) {
		let procDate = new Date(date);
		return `${procDate.getDate()}/${procDate.getMonth() + 1}/${procDate.getFullYear().toString().substr(2)}`;
	}
	createDate(days) {
		let today = this.currentDate(),
			daysArray = [];
		for (let i = days - 1; i >= 0; i--) {
			daysArray.push(today - i * 1000 * 60 * 60 * 24);
		}

		return daysArray;
	}
	getDataList(days: number): Observable<any> {
		return this.cloudService.getDataById(this.userId, Table.LEADS).pipe(
			map(leads => {
				if (leads) {
					let leadsResult = leads.lidData
						.filter(filtered => this.convertDate(filtered) <= days)
						.map(lead => {
							return +lead.date;
						});
					return leadsResult;
				} else return [];
			})
		);
	}
}
