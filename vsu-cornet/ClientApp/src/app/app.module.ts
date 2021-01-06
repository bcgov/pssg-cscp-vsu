import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ClientSearchComponent } from './client-search/client-search.component';
import { DecimalPipe } from '@angular/common';
import { FieldComponent } from './shared/field/field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule, MatDialogModule, MatProgressSpinnerModule, MatStepperModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from './shared/directives/sortable.directive';
import { NgxMaskModule } from 'ngx-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { SubjectInformationComponent } from './shared/subject-information/subject-information.component';
import { MovementsComponent } from './shared/movements/movements.component';
import { VictimContactsComponent } from './shared/victim-contacts/victim-contacts.component';
import { HearingsComponent } from './shared/hearings/hearings.component';
import { StateTransitionsComponent } from './shared/state-transitions/state-transitions.component';
import { CornetInfoLoadingHandler } from './cornet-info-loading-handler/cornet-info.component';

@NgModule({
  declarations: [
    AppComponent,
    CornetInfoLoadingHandler,
    ClientSearchComponent,
    ClientDetailsComponent,
    SubjectInformationComponent,
    MovementsComponent,
    VictimContactsComponent,
    HearingsComponent,
    StateTransitionsComponent,
    FieldComponent,
    HomeComponent,
    NgbdSortableHeader,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  exports: [
    AppRoutingModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
