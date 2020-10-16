import { AddressComponent } from './shared/components/address/address.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApplicantInformationComponent } from './shared/components/applicant-information/applicant-information.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CaseInformationComponent } from './shared/components/case-information/case-information.component';
import { FieldComponent } from './shared/field/field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LookupService } from './services/lookup.service';
import { MatDatepickerModule, MatIconModule, MatStepperModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { NotificationApplicationComponent } from './noticiation-application/noticiation-application.component';
import { OverviewComponent } from './shared/components/overview/overview.component';
import { RecipientDetailsComponent } from './shared/components/recipient-details/recipient-details.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
  declarations: [
    AddressComponent,
    AppComponent,
    ApplicantInformationComponent,
    CaseInformationComponent,
    FieldComponent,
    HomeComponent,
    NotificationApplicationComponent,
    OverviewComponent,
    RecipientDetailsComponent,
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
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
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
