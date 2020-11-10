import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFieldsComponent } from './dynamic-fields.component';
import { DynamicFieldsRoutingModule } from './dynamic-fields-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	declarations: [DynamicFieldsComponent],
	imports: [CommonModule, DynamicFieldsRoutingModule, MatButtonModule, MatSidenavModule, MatIconModule],
})
export class DynamicFieldsModule {}
