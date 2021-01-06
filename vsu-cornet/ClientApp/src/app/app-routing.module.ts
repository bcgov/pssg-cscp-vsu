import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientSearchComponent } from './client-search/client-search.component';
import { CornetInfoLoadingHandler } from './cornet-info-loading-handler/cornet-info.component';

const routes: Routes = [
  // {
  //   path: '', component: HomeComponent, pathMatch: 'full'
  // },
  {
    path: '', redirectTo: 'client-search', pathMatch: 'full'
  },
  {
    path: 'cornet-info', component: CornetInfoLoadingHandler, pathMatch: 'full'
  },
  {
    path: 'cornet-info/:vsd_offenderid', component: CornetInfoLoadingHandler, pathMatch: 'full'
  },
  {
    path: 'client-search', component: ClientSearchComponent, pathMatch: 'full'
  },
  {
    path: 'client-details/:clientNumber', component: ClientDetailsComponent, pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
