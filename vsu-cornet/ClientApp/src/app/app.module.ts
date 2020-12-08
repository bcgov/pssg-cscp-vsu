import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatDialogModule, MatIconModule, MatStepperModule } from '@angular/material';
import { NgxMaskModule } from 'ngx-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClientSearchComponent } from './client-search/client-search.component';
import { FieldComponent } from './shared/field/field.component';
import { DecimalPipe } from '@angular/common';
import { NgbdSortableHeader } from './shared/directives/sortable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClientSearchComponent,
    FieldComponent,
    NgbdSortableHeader
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatDialogModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    TooltipModule.forRoot(),
  ],
  exports: [
    AppRoutingModule,
    MatDatepickerModule,
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
