import { NgModule } from '@angular/core';
import { canActivate } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedToLogin } from '@utils/fire-guard.utils';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { DatePipe } from '@angular/common';

const routes: Routes = [{ path: '', component: LeadsListComponent, ...canActivate(redirectUnauthorizedToLogin) }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	providers: [DatePipe],
	exports: [RouterModule],
})
export class LeadsRoutingModule {}
