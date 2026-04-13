import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { healthCheckGuard } from './guards/health.guard';
import { HomeComponent } from './home/home.component';
import { NotificationApplicationComponent } from './notification-application/notification-application.component';
import { OutageComponent } from './outage/outage.component';
import { VictimTravelFundApplicationComponent } from './victim-travel-fund-application/vtf-application.component';
import { VictimTravelFundReimbursementComponent } from './victim-travel-fund-reimbursement/vtf-reimbursement.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [healthCheckGuard]
  },
  {
    path: 'notification_application',
    component: NotificationApplicationComponent,
    canActivate: [healthCheckGuard]
  },
  {
    path: 'vtf_application',
    component: VictimTravelFundApplicationComponent,
    canActivate: [healthCheckGuard]
  },
  {
    path: 'vtf_reimbursement',
    component: VictimTravelFundReimbursementComponent,
    canActivate: [healthCheckGuard]
  },
  {
    path: 'outage',
    component: OutageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
