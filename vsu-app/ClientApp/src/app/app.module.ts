import { AngularSignaturePadModule as SignaturePadModule } from '@almothafar/angular-signature-pad';
import { A11yModule } from '@angular/cdk/a11y';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { GenderSelectorComponent } from 'src/app/shared/components/gender-selector/gender-selector.component';
import { PronounSelectorComponent } from 'src/app/shared/components/pronoun-selector/pronoun-selector.component';
import { RaceSelectorComponent } from 'src/app/shared/components/race-selector/race-selector.component';
import { FeatureEnabledDirective } from 'src/app/shared/directives/feature-enabled.directive';
import { ReimbursementService } from '../api/reimbursement/reimbursement.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotificationApplicationComponent } from './notification-application/notification-application.component';
import { OutageComponent } from './outage/outage.component';
import { AdditionalInfoBannerComponent } from './shared/components/additional-info-banner/additional-info-banner.component';
import { AddressComponent } from './shared/components/address/address.component';
import { ApplicantInformationComponent } from './shared/components/applicant-information/applicant-information.component';
import { AuthorizationComponent } from './shared/components/authorization/authorization.component';
import { CaseInformationComponent } from './shared/components/case-information/case-information.component';
import { ConfirmationComponent } from './shared/components/confirmation/confirmation.component';
import { ContactMethodComponent } from './shared/components/contact-method/contact-method.component';
import { DesignateComponent } from './shared/components/designate/designate.component';
import { FileUploaderComponent } from './shared/components/file-uploader/file-uploader.component';
import { NotificationOverviewComponent } from './shared/components/notification-overview/overview.component';
import { RecipientDetailsComponent } from './shared/components/recipient-details/recipient-details.component';
import { ToolTipTriggerComponent } from './shared/components/tool-tip/tool-tip.component';
import { TravelExpensesComponent } from './shared/components/travel-expenses/travel-expenses.component';
import { TravelInformationComponent } from './shared/components/travel-information/travel-information.component';
import { TravelOverviewComponent } from './shared/components/travel-overview/travel-overview.component';
import { VSWComponent } from './shared/components/victim-service-worker/victim-service-worker.component';
import { VTFCaseInformationComponent } from './shared/components/vtf-case-information/vtf-case-information.component';
import { DateFieldComponent } from './shared/date-field/date-field.component';
import { SignPadDialog } from './shared/dialogs/sign-dialog/sign-dialog.component';
import { FieldComponent } from './shared/field/field.component';
import { NotificationBannerComponent } from './shared/notification-banner/notification-banner.component';
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
    FeatureEnabledDirective,
    FieldComponent,
    FileUploaderComponent,
    GenderSelectorComponent,
    HomeComponent,
    NotificationApplicationComponent,
    NotificationBannerComponent,
    NotificationOverviewComponent,
    PronounSelectorComponent,
    RaceSelectorComponent,
    RecipientDetailsComponent,
    SignPadDialog,
    ToolTipTriggerComponent,
    TravelExpensesComponent,
    TravelInformationComponent,
    TravelOverviewComponent,
    VictimTravelFundApplicationComponent,
    VictimTravelFundReimbursementComponent,
    VSWComponent,
    VTFCaseInformationComponent,
    OutageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    ReactiveFormsModule,
    SignaturePadModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
    A11yModule
  ],
  exports: [AppRoutingModule, MatDatepickerModule, MatProgressSpinnerModule, NotificationBannerComponent],
  providers: [
    provideNgxMask(),
    ReimbursementService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
