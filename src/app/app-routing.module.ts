import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './component/layout/layout/layout.component';
import { URL_ROUTES } from '@model/url-routes';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./component/user/user.module').then(m => m.UserModule),
	},
	{
		path: URL_ROUTES.profile,
		component: LayoutComponent,
		loadChildren: () => import('./component/user-profile/user-profile.module').then(m => m.UserProfileModule),
	},
	{
		path: URL_ROUTES.fields,
		component: LayoutComponent,
		loadChildren: () => import('./component/dynamic-fields/dynamic-fields.module').then(m => m.DynamicFieldsModule),
	},
	{
		path: URL_ROUTES.dashboard,
		component: LayoutComponent,
		loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule),
	},
	{
		path: URL_ROUTES.leads,
		component: LayoutComponent,
		loadChildren: () => import('./component/leads/leads.module').then(m => m.LeadsModule),
	},
	{ path: '**', redirectTo: URL_ROUTES.mainpage, pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
