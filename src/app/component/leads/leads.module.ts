import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LeadsRoutingModule } from './leads-routing.module';
import { CloudService } from '@service/cloud.service';
import { MessageService } from '@service/message.service';
import { UserDataService } from '@service/user/user-data.service';
import { TooltipDirective } from './leads-list/tooltip.directive';
import { MatSelectModule } from '@angular/material/select';
import { DynamicFieldsService } from '@service/dynamic-fields.service';

@NgModule({
	declarations: [LeadsListComponent, TooltipDirective],
	imports: [
		CommonModule,
		LeadsRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSidenavModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		DragDropModule,
		MatIconModule,
		MatSelectModule,
	],
	providers: [CloudService, MessageService, UserDataService, DynamicFieldsService],
})
export class LeadsModule {}
