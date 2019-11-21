import { TransactionUpdateComponent } from './transactions/transaction-update/transaction-update.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LastTransactionsResolverService, TransactionsResolverService } from './@resolvers/transactions-resolver.service';
import { AuthGuard } from './@guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppComponent } from './app.component';
import { TransactionComponent, TransactionRootComponent } from './transactions/transaction.component';
import { InsurerComponent } from './insurer/insurer.component';
import { InsurerResolverService } from './@resolvers/insurer-resolver.service';
import { TransactionGuard } from './@guards/transaction.guard';
import { TransactionsUploadComponent, TransactionUploadDialogComponent } from './transactions/upload/upload.component';
import { TransactionsAddComponent } from './transactions/add/add.component';
import { TransactionAddResolverService } from './@resolvers/transaction-add-resolver.service';
import {UsersComponent} from './users/users.component';
import {UserResolverService} from './@resolvers/user-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', component: DashboardComponent,
        resolve: {
          lastInsurersPaiements: InsurerResolverService,
          lastTransactions: TransactionsResolverService
        }
      },
      {
        path: 'transactions',
        component: TransactionRootComponent,
        children: [
          {
            path: '',
            component: TransactionComponent,
            resolve: {
              transactions: TransactionsResolverService
            }
          },
          {
            path: 'upload',
            component: TransactionUploadDialogComponent,
            resolve: {
              insurers: InsurerResolverService
            }
          },
          {
            path: ':data',
            component: TransactionsAddComponent,
            resolve: {
              transactionData: TransactionAddResolverService,
              insurers: InsurerResolverService,
            }
          },
          {
            path: 'update',
            component: TransactionsAddComponent,
            resolve: {
              transactionData: TransactionAddResolverService,
              insurers: InsurerResolverService,
            }
          },
        ]

      },
      // { path: 'add', component: TransactionUploadComponent },
      // { path: 'add/:data', component: TransactionUploadComponent },
      {
        path: 'users',
        component: UsersComponent,
        resolve: { insurers: UserResolverService}
      },
      {
        path: 'insurers', component: InsurerComponent, resolve: {
          insurers: InsurerResolverService
        }
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
