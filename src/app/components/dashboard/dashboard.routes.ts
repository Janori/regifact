import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardOcComponent } from './dashboard-oc/dashboard-oc.component';
import { DashboardProfileComponent } from './dashboard-profile/dashboard-profile.component';
import { DashboardProvidersComponent } from './dashboard-providers/dashboard-providers.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';

import { DashboardUsersEditComponent } from './dashboard-users/dashboard-users-edit.component';
import { DashboardUsersCreateComponent } from './dashboard-users/dashboard-users-create.component';

const APP_ROUTES: Routes = [
  { path: 'home', component: DashboardHomeComponent },
  { path: 'oc', component: DashboardOcComponent },
  { path: 'profile', component: DashboardProfileComponent },
  { path: 'providers', component: DashboardProvidersComponent },
  { path: 'users', component: DashboardUsersComponent },
  { path: 'users/:id/edit', component: DashboardUsersEditComponent },
  { path: 'users/create', component: DashboardUsersCreateComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const DASHBOARD_ROUTING = APP_ROUTES;
