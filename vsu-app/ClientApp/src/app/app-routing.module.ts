import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationApplicationComponent } from './noticiation-application/noticiation-application.component';
import { VictimTravelFundApplicationComponent } from './victim-travel-fund-application/vtf-application.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full'
  },
  // {
  //   path: '', redirectTo: 'notification_applicaiton', pathMatch: 'full'
  // },
  {
    path: 'notification_applicaiton',
    component: NotificationApplicationComponent
  },
  {
    path: 'victim_travel_fund_applicaiton',
    component: VictimTravelFundApplicationComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
