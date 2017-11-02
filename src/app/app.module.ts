import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

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
import { DashboardProvidersSetComponent } from './components/dashboard/dashboard-providers/dashboard-providers-set.component';

//Routes
import { APP_ROUTING } from './app.routes';

//directives
import { SelectOnClickDirective } from './directives/select-on-click.directive';

//Services
import { PorderService } from './services/porder.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AccessGuardService } from './services/access-guard.service';
import { ConstService } from './services/const.service';
import { UsersService } from './services/users.service';
import { SearchService } from './services/search.service';

//Pipes
import { EnumWsPipe } from './pipes/enum-ws.pipe';
import { DomsafePipe } from './pipes/domsafe.pipe';

import { DashboardUsersEditComponent } from './components/dashboard/dashboard-users/dashboard-users-edit.component';
import { DashboardUsersCreateComponent } from './components/dashboard/dashboard-users/dashboard-users-create.component';

//Material
import {MdInputModule, MdSelectModule,
       MdPaginatorModule, MdDialogModule,
       MdButtonModule, MdCardModule,
       MdDatepickerModule, MdNativeDateModule,
       MdCheckboxModule, MdTooltipModule,
       MdTabsModule, MdSnackBarModule  } from '@angular/material';

import { DialogResultCreateComponent } from './components/shared/dialog-result-create/dialog-result-create.component';
import { SearchboxComponent } from './components/shared/searchbox/searchbox.component';
import { PaginatorComponent } from './components/shared/paginator/paginator.component';
import { DndDirective } from './directives/dnd.directive';
import { DashboardUsersOCComponent } from './components/dashboard/dashboard-users/dashboard-users-oc/dashboard-users-oc.component';
import { DonnutComponent } from './components/shared/donnut/donnut.component';
import { DialogResultConfirmComponent } from './components/shared/dialog-result-confirm/dialog-result-confirm.component';
import { DashboardOcProvidersComponent } from './components/dashboard/dashboard-oc-providers/dashboard-oc-providers.component';
import { DialogResultOpenOrDownloadComponent } from './components/shared/dialog-result-open-or-download/dialog-result-open-or-download.component';


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
    EnumWsPipe, DomsafePipe,
    DashboardUsersEditComponent,
    DashboardUsersCreateComponent,
    DashboardProvidersSetComponent,
    DialogResultCreateComponent,
    SearchboxComponent,
    PaginatorComponent,
    DndDirective,
    DashboardUsersOCComponent,
    DonnutComponent,
    DialogResultConfirmComponent,
    DashboardOcProvidersComponent,
    DialogResultOpenOrDownloadComponent,
  ],
  entryComponents: [
    DialogResultCreateComponent,
    DialogResultConfirmComponent,
    DialogResultOpenOrDownloadComponent
  ],
  imports: [
    APP_ROUTING,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MdInputModule, MdSelectModule, MdDialogModule, MdPaginatorModule,
    MdButtonModule, MdCardModule, MdDatepickerModule, MdNativeDateModule,
    MdCheckboxModule, MdTabsModule, MdSnackBarModule,
    ChartsModule,
    MdTooltipModule,
  ],
  providers: [
    PorderService,
    AuthService,
    AccessGuardService,
    AuthGuardService,
    ConstService,
    UsersService,
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
