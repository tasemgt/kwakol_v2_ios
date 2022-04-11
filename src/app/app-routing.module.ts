import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    // canActivate: [AuthenGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/auth/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'alert-modal',
    loadChildren: () => import('./pages/modals/alert-modal/alert-modal.module').then( m => m.AlertModalPageModule)
  },
  {
    path: 'deposit',
    loadChildren: () => import('./pages/subpages/for-home/deposit/deposit.module').then( m => m.DepositPageModule)
  },
  {
    path: 'bottom-drawer',
    loadChildren: () => import('./pages/modals/bottom-drawer/bottom-drawer.module').then( m => m.BottomDrawerPageModule)
  },
  {
    path: 'withdrawal',
    loadChildren: () => import('./pages/subpages/for-home/withdrawal/withdrawal.module').then( m => m.WithdrawalPageModule)
  },
  {
    path: 'new-account',
    loadChildren: () => import('./pages/subpages/for-portfolio/new-account/new-account.module').then( m => m.NewAccountPageModule)
  },
  {
    path: 'investment-details',
    loadChildren: () => import('./pages/subpages/for-portfolio/investment-details/investment-details.module').then( m => m.InvestmentDetailsPageModule)
  },
  {
    path: 'add-new-account',
    loadChildren: () => import('./pages/subpages/for-portfolio/add-new-account/add-new-account.module').then( m => m.AddNewAccountPageModule)
  },
  {
    path: 'history-summary',
    loadChildren: () => import('./pages/subpages/for-history/history-summary/history-summary.module').then( m => m.HistorySummaryPageModule)
  },
  {
    path: 'feed-details',
    loadChildren: () => import('./pages/subpages/for-feed/feed-details/feed-details.module').then( m => m.FeedDetailsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
