import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientSearchComponent } from './client-search/client-search.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // {
  //   path: '', component: HomeComponent, pathMatch: 'full'
  // },
  {
    path: '', redirectTo: 'client-search', pathMatch: 'full'
  },
  {
    path: 'client-search', component: ClientSearchComponent, pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
