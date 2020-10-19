import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationApplicationComponent } from './noticiation-application/noticiation-application.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'notification_applicaiton', pathMatch: 'full'
    // component: NotificationApplicationComponent
  },
  {
    path: 'notification_applicaiton',
    component: NotificationApplicationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
