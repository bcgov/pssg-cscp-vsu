import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationApplicationComponent } from './notification-application/notification-application.component';
import { VictimTravelFundApplicationComponent } from './victim-travel-fund-application/vtf-application.component';
import { VictimTravelFundReimbursementComponent } from './victim-travel-fund-reimbursement/vtf-reimbursement.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full'
  },
  // {
  //   path: '', redirectTo: 'notification_application', pathMatch: 'full'
  // },
  {
    path: 'notification_application',
    component: NotificationApplicationComponent
  },
  {
    path: 'vtf_application',
    component: VictimTravelFundApplicationComponent
  },
  {
    path: 'vtf_reimbursement',
    component: VictimTravelFundReimbursementComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
