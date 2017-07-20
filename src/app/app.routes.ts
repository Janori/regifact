import { RouterModule, Routes } from '@angular/router';

import { DASHBOARD_ROUTING } from './components/dashboard/dashboard.routes';

import { AuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [ AuthGuardService ],
    component: DashboardComponent,
    children: DASHBOARD_ROUTING
  },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
