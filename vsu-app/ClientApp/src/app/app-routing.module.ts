import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { healthCheckGuard } from './guards/health.guard';
import { maintenanceGuard } from './guards/maintenance.guard';
import { HomeComponent } from './home/home.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { NotificationApplicationComponent } from './notification-application/notification-application.component';
import { OutageComponent } from './outage/outage.component';
import { VictimTravelFundApplicationComponent } from './victim-travel-fund-application/vtf-application.component';
import { VictimTravelFundReimbursementComponent } from './victim-travel-fund-reimbursement/vtf-reimbursement.component';

const routes: Routes = [
  {
    path: 'outage',
    component: OutageComponent
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [healthCheckGuard, maintenanceGuard]
  },
  {
    path: 'notification_application',
    component: NotificationApplicationComponent,
    canActivate: [healthCheckGuard, maintenanceGuard]
  },
  {
    path: 'vtf_application',
    component: VictimTravelFundApplicationComponent,
    canActivate: [healthCheckGuard, maintenanceGuard]
  },
  {
    path: 'vtf_reimbursement',
    component: VictimTravelFundReimbursementComponent,
    canActivate: [healthCheckGuard, maintenanceGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
