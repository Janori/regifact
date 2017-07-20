import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/dashboard/navbar/navbar.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import { DashboardUsersComponent } from './components/dashboard/dashboard-users/dashboard-users.component';
import { DashboardProvidersComponent } from './components/dashboard/dashboard-providers/dashboard-providers.component';
import { DashboardOcComponent } from './components/dashboard/dashboard-oc/dashboard-oc.component';
import { DashboardProfileComponent } from './components/dashboard/dashboard-profile/dashboard-profile.component';

//Routes
import { APP_ROUTING } from './app.routes';

//directives
import { SelectOnClickDirective } from './directives/select-on-click.directive';

//Services
import { PorderService } from './services/porder.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ConstService } from './services/const.service';
import { UsersService } from './services/users.service';

//Pipes
import { EnumWsPipe } from './pipes/enum-ws.pipe';
import { DashboardUsersEditComponent } from './components/dashboard/dashboard-users/dashboard-users-edit.component';
import { DashboardUsersCreateComponent } from './components/dashboard/dashboard-users/dashboard-users-create.component';

//Material
import {MdInputModule, MdSelectModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    SelectOnClickDirective,
    DashboardComponent,
    NavbarComponent,
    DashboardHomeComponent,
    DashboardUsersComponent,
    DashboardProvidersComponent,
    DashboardOcComponent,
    DashboardProfileComponent,
    EnumWsPipe,
    DashboardUsersEditComponent,
    DashboardUsersCreateComponent
  ],
  imports: [
    APP_ROUTING,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdInputModule, MdSelectModule
  ],
  providers: [
    PorderService,
    AuthService,
    AuthGuardService,
    ConstService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
