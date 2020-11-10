import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { URL_ROUTES } from '@model/url-routes';

export const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([URL_ROUTES.login]);

export const redirectLoggedInToLeadsList = () => redirectLoggedInTo([URL_ROUTES.mainpage]);
