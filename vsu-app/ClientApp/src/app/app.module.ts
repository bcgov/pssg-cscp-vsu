import { AdditionalInfoBannerComponent } from './shared/components/additional-info-banner/additional-info-banner.component';
import { AddressComponent } from './shared/components/address/address.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApplicantInformationComponent } from './shared/components/applicant-information/applicant-information.component';
import { ApplicationService } from './services/application.service';
import { AuthorizationComponent } from './shared/components/authorization/authorization.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CaseInformationComponent } from './shared/components/case-information/case-information.component';
import { ConfirmationComponent } from './shared/components/confirmation/confirmation.component';
import { ContactMethodComponent } from './shared/components/contact-method/contact-method.component';
import { DateFieldComponent } from './shared/date-field/date-field.component';
import { DesignateComponent } from './shared/components/designate/designate.component';
import { FieldComponent } from './shared/field/field.component';
import { FileUploaderComponent } from './shared/components/file-uploader/file-uploader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LookupService } from './services/lookup.service';
import { MatButtonModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatStepperModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { NotificationApplicationComponent } from './notification-application/notification-application.component';
import { NotificationBannerComponent } from './shared/notification-banner/notification-banner.component';
import { NotificationOverviewComponent } from './shared/components/notification-overview/overview.component';
import { RecipientDetailsComponent } from './shared/components/recipient-details/recipient-details.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SignPadDialog } from './shared/dialogs/sign-dialog/sign-dialog.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ToolTipTriggerComponent } from './shared/components/tool-tip/tool-tip.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TravelExpensesComponent } from './shared/components/travel-expenses/travel-expenses.component';
import { TravelInformationComponent } from './shared/components/travel-information/travel-information.component';
import { TravelOverviewComponent } from './shared/components/travel-overview/travel-overview.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { VSWComponent } from './shared/components/victim-service-worker/victim-service-worker.component';
import { VTFCaseInformationComponent } from './shared/components/vtf-case-information/vtf-case-information.component';
import { VictimTravelFundApplicationComponent } from './victim-travel-fund-application/vtf-application.component';
import { VictimTravelFundReimbursementComponent } from './victim-travel-fund-reimbursement/vtf-reimbursement.component';

@NgModule({
  declarations: [
    AdditionalInfoBannerComponent,
    AddressComponent,
    AppComponent,
    ApplicantInformationComponent,
    AuthorizationComponent,
    CaseInformationComponent,
    ConfirmationComponent,
    ContactMethodComponent,
    DateFieldComponent,
    DesignateComponent,
    FieldComponent,
    FileUploaderComponent,
    HomeComponent,
    NotificationApplicationComponent,
    NotificationBannerComponent,
    NotificationOverviewComponent,
    RecipientDetailsComponent,
    SignPadDialog,
    ToolTipTriggerComponent,
    TravelExpensesComponent,
    TravelInformationComponent,
    TravelOverviewComponent,
    VSWComponent,
    VTFCaseInformationComponent,
    VictimTravelFundApplicationComponent,
    VictimTravelFundReimbursementComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
    MatProgressSpinnerModule,
    NotificationBannerComponent,
  ],
  providers: [
    LookupService,
    ApplicationService,
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
