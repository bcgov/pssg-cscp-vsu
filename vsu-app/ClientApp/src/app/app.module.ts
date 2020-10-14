
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CaseInformationComponent } from './shared/components/case-information/case-information.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { FieldComponent } from './shared/field/field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LookupService } from './services/lookup.service';
import { MatDatepickerModule, MatIconModule, MatStepperModule } from '@angular/material';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NgModule } from '@angular/core';
import { NotificationApplicationComponent } from './noticiation-application/noticiation-application.component';
import { OverviewComponent } from './shared/components/overview/overview.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    AppComponent,
    CaseInformationComponent,
    CounterComponent,
    FetchDataComponent,
    FieldComponent,
    HomeComponent,
    NavMenuComponent,
    NotificationApplicationComponent,
    OverviewComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatIconModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  exports: [
    AppRoutingModule,
    MatDatepickerModule,
  ],
  providers: [
    LookupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
