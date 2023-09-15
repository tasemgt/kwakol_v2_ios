import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenGuard } from './guards/authen.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'alert-modal',
    loadChildren: () =>
      import('./pages/modals/alert-modal/alert-modal.module').then(
        (m) => m.AlertModalPageModule
      ),
  },
  {
    path: 'deposit',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-home/deposit/deposit.module').then(
        (m) => m.DepositPageModule
      ),
  },
  {
    path: 'new-account',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-portfolio/new-account/new-account.module'
      ).then((m) => m.NewAccountPageModule),
  },
  {
    path: 'add-new-account',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-portfolio/add-new-account/add-new-account.module'
      ).then((m) => m.AddNewAccountPageModule),
  },
  {
    path: 'feed-details',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-feed/feed-details/feed-details.module').then(
        (m) => m.FeedDetailsPageModule
      ),
  },
  {
    path: 'affiliate-link',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-profile/affiliate-link/affiliate-link.module'
      ).then((m) => m.AffiliateLinkPageModule),
  },
  {
    path: 'referral-code',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-profile/referral-code/referral-code.module'
      ).then((m) => m.ReferralCodePageModule),
  },
  {
    path: 'account-details',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-profile/account-details/account-details.module'
      ).then((m) => m.AccountDetailsPageModule),
  },
  {
    path: 'settings',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-profile/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'change-password',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/auth/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  {
    path: 'lock-modal',
    loadChildren: () =>
      import('./pages/modals/lock-modal/lock-modal.module').then(
        (m) => m.LockModalPageModule
      ),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./pages/auth/onboarding/onboarding.module').then(
        (m) => m.OnboardingPageModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'loading',
    loadChildren: () =>
      import('./pages/modals/loading/loading.module').then(
        (m) => m.LoadingPageModule
      ),
  },
  {
    path: 'kyc',
    loadChildren: () =>
      import('./pages/auth/kyc/kyc.module').then((m) => m.KycPageModule),
  },
  {
    path: 'wallet-transfer-user',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-generic/wallet-transfer-user/wallet-transfer-user.module'
      ).then((m) => m.WalletTransferUserPageModule),
  },
  {
    path: 'beneficiaries',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-home/beneficiaries/beneficiaries.module'
      ).then((m) => m.BeneficiariesPageModule),
  },
  {
    path: 'next-of-kin',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-profile/next-of-kin/next-of-kin.module'
      ).then((m) => m.NextOfKinPageModule),
  },
  {
    path: 'notifications',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-feed/notifications/notifications.module'
      ).then((m) => m.NotificationsPageModule),
  },
  {
    path: 'faqs',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-feed/faqs/faqs.module').then(
        (m) => m.FaqsPageModule
      ),
  },
  {
    path: 'faq-details',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-feed/faq-details/faq-details.module').then(
        (m) => m.FaqDetailsPageModule
      ),
  },
  {
    path: 'feeds',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-feed/feeds/feeds.module').then(
        (m) => m.FeedsPageModule
      ),
  },
  {
    path: 'invest-in-account',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-portfolio/invest-in-account/invest-in-account.module'
      ).then((m) => m.InvestInAccountPageModule),
  },
  {
    path: 'create-beneficiary',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-home/create-beneficiary/create-beneficiary.module'
      ).then((m) => m.CreateBeneficiaryPageModule),
  },
  {
    path: 'investment-details',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-home/investment-details/investment-details.module'
      ).then((m) => m.InvestmentDetailsPageModule),
  },
  {
    path: 'beneficiary-details',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-home/beneficiary-details/beneficiary-details.module'
      ).then((m) => m.BeneficiaryDetailsPageModule),
  },
  {
    path: 'add-bank',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import('./pages/subpages/for-home/add-bank/add-bank.module').then(
        (m) => m.AddBankPageModule
      ),
  },
  {
    path: 'edit-profile',
    canActivate: [AuthenGuard],
    loadChildren: () =>
      import(
        './pages/subpages/for-profile/edit-profile/edit-profile.module'
      ).then((m) => m.EditProfilePageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
