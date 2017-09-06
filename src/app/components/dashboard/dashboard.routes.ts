import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardOcComponent } from './dashboard-oc/dashboard-oc.component';
import { DashboardProfileComponent } from './dashboard-profile/dashboard-profile.component';
import { DashboardProvidersComponent } from './dashboard-providers/dashboard-providers.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';

import { DashboardUsersEditComponent } from './dashboard-users/dashboard-users-edit.component';
import { DashboardUsersCreateComponent } from './dashboard-users/dashboard-users-create.component';
import { DashboardUsersOCComponent } from './dashboard-users/dashboard-users-oc/dashboard-users-oc.component';

import { DashboardProvidersSetComponent } from './dashboard-providers/dashboard-providers-set.component';

import { AccessGuardService } from '../../services/access-guard.service';
import { AuthGuardService } from '../../services/auth-guard.service';

const APP_ROUTES: Routes = [
  { path: 'home', canActivate: [ AccessGuardService, AuthGuardService ],
                component: DashboardHomeComponent },
  { path: 'oc', canActivate: [ AccessGuardService, AuthGuardService ],
                component: DashboardOcComponent },
  { path: 'profile', canActivate: [ AuthGuardService],
                component: DashboardProfileComponent },
  { path: 'providers', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardProvidersComponent },
  { path: 'users', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardUsersComponent },
  { path: 'users/:id/edit', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardUsersEditComponent },
  { path: 'users/create', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardUsersCreateComponent },
  { path: 'providers/:id/edit', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardProvidersSetComponent },
  { path: 'providers/create', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardProvidersSetComponent },
  { path: 'providers/:userId/add-oc', canActivate: [ AuthGuardService, AccessGuardService ],
                component: DashboardUsersOCComponent },
  { path: 'providers/:userId/edit-oc/:ocId', canActivate: [ AuthGuardService,  AccessGuardService ],
                component: DashboardUsersOCComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const DASHBOARD_ROUTING = APP_ROUTES;
