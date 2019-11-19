import {
  TransactionConfirmationDialogComponent
} from './transactions/transaction-confirmation-dialog/transaction-confirmation-dialog.component';
import { InsurerUpdateDialogComponent } from './insurer/insurer-update/insurer-update-dialog.component';

import { InsurerConfirmationDialogComponent } from './insurer/insurer-confirmation-dialog/insurer-confirmation-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { NavigationComponent } from './navigation/navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { TransactionService } from './@services/transaction.service';
import { AuthService } from './@services/auth.service';
import { ToastService } from './@services/toast.service';
import { StorageService } from './@services/storage.service';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TransactionBoardComponent } from './transaction-board/transaction-board.component';
import { SpeedDialFabComponent } from './speed-dial-fab/speed-dial-fab.component';
import { TransactionComponent, TransactionRootComponent } from './transactions/transaction.component';
import { InsurerComponent } from './insurer/insurer.component';
import { TransactionsUploadComponent, TransactionUploadDialogComponent } from './transactions/upload/upload.component';
import { LoaderService } from './@services/loader.service';
import { DragDropDirective } from './drag-drop.directive';
import { TransactionsAddComponent, WarnigDialogComponent } from './transactions/add/add.component';
import { AddInsurerDialogComponent } from './insurer/insurer-add/insurer-add-dialog.component';
import { PwaService } from './@services/pwa.service';
import { InsurerService } from './@services/insurer.service';
import { CancelDialogComponent } from './transactions/cancel-dialog/cancel-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionUpdateComponent } from './transactions/transaction-update/transaction-update.component';
import { UsersComponent } from './users/users.component';
import {UserDialogComponent} from './users/user-dialog/user-dialog.component';

@NgModule({
   declarations: [
      AppComponent,
      PageNotFoundComponent,
      DragDropDirective,
      LoginComponent,
      TransactionBoardComponent,
      TransactionRootComponent,
      SpeedDialFabComponent,
      TransactionComponent,
      NavigationComponent,
      CancelDialogComponent,
      DashboardComponent,
      TransactionsUploadComponent,
      InsurerComponent,
      AddInsurerDialogComponent,
      WarnigDialogComponent,
      TransactionUploadDialogComponent,
      TransactionsAddComponent,
      InsurerConfirmationDialogComponent,
      InsurerUpdateDialogComponent,
      TransactionConfirmationDialogComponent,
      SettingsComponent,
      TransactionUpdateComponent,
      UsersComponent,
     UserDialogComponent
   ],
   imports: [
      ServiceWorkerModule.register('ngsw-worker.js'),
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    LayoutModule,
  ],
  entryComponents: [
    AddInsurerDialogComponent,
    CancelDialogComponent,
    TransactionsUploadComponent,
    WarnigDialogComponent,
    InsurerConfirmationDialogComponent,
    InsurerUpdateDialogComponent,
    TransactionConfirmationDialogComponent,
    SettingsComponent,
    UserDialogComponent,
  ],
  providers: [
    TransactionService,
    AuthService,
    TransactionService,
    StorageService,
    ToastService,
    LoaderService,
    PwaService,
    InsurerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
