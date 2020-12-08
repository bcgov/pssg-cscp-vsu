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
import { MatDatepickerModule, MatDialogModule, MatProgressSpinnerModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from './shared/directives/sortable.directive';
import { NgxMaskModule } from 'ngx-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
  declarations: [
    AppComponent,
    ClientSearchComponent,
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
