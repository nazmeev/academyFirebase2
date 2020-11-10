import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { URL_ROUTES } from '@model/url-routes';
import { redirectLoggedInToLeadsList, redirectUnauthorizedToLogin } from '@utils/fire-guard.utils';
import {
	LoginComponent,
	LogoutComponent,
	NewPasswordComponent,
	ResetPasswordComponent,
	SignupComponent,
	VerifyAuthActionComponent,
} from './components';

const routes: Routes = [
	{
		path: '',
		redirectTo: URL_ROUTES.login,
		pathMatch: 'full',
	},
	{ path: URL_ROUTES.signup, component: SignupComponent, ...canActivate(redirectLoggedInToLeadsList) },
	{ path: URL_ROUTES.login, component: LoginComponent, ...canActivate(redirectLoggedInToLeadsList) },
	{ path: URL_ROUTES.logout, component: LogoutComponent, ...canActivate(redirectUnauthorizedToLogin) },
	{ path: URL_ROUTES.resetpassword, component: ResetPasswordComponent, ...canActivate(redirectLoggedInToLeadsList) },
	{ path: URL_ROUTES.authaction, component: VerifyAuthActionComponent },
	{ path: URL_ROUTES.newpassword, component: NewPasswordComponent, ...canActivate(redirectLoggedInToLeadsList) },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	providers: [],
	exports: [RouterModule],
})
export class UserRoutingModule {}
