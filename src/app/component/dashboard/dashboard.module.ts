import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		GoogleChartsModule,
		MatDividerModule,
		MatSelectModule,
		MatFormFieldModule,
	],
})
export class DashboardModule {}
