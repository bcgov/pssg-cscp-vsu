import { AddressComponent } from './shared/components/address/address.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApplicantInformationComponent } from './shared/components/applicant-information/applicant-information.component';
import { AuthorizationComponent } from './shared/components/authorization/authorization.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CaseInformationComponent } from './shared/components/case-information/case-information.component';
import { FieldComponent } from './shared/field/field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LookupService } from './services/lookup.service';
import { MatDatepickerModule, MatDialogModule, MatIconModule, MatStepperModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { NotificationApplicationComponent } from './noticiation-application/noticiation-application.component';
import { OverviewComponent } from './shared/components/overview/overview.component';
import { RecipientDetailsComponent } from './shared/components/recipient-details/recipient-details.component';
import { SignPadDialog } from './shared/dialogs/sign-dialog/sign-dialog.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NotificationBannerComponent } from './shared/notification-banner/notification-banner.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    AddressComponent,
    AppComponent,
    ApplicantInformationComponent,
    AuthorizationComponent,
    CaseInformationComponent,
    FieldComponent,
    HomeComponent,
    NotificationApplicationComponent,
    NotificationBannerComponent,
    OverviewComponent,
    RecipientDetailsComponent,
    SignPadDialog,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatStepperModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    SignaturePadModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  exports: [
    AppRoutingModule,
    MatDatepickerModule,
    NotificationBannerComponent,
  ],
  providers: [
    LookupService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
  ],
  entryComponents: [
    SignPadDialog,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
