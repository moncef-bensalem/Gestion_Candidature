import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { JobOffersComponent } from './components/job-offers/job-offers.component';
import { JobOfferDetailComponent } from './components/job-offer-detail/job-offer-detail.component';
import { AboutComponent } from './components/about/about.component';
import { SharedModule } from './shared/shared.module';
import { CreateOfferComponent } from './components/company/create-offer/create-offer.component';
import { ManageOffersComponent } from './components/company/manage-offers/manage-offers.component';
import { CompanyHomeComponent } from './components/company/company-home/company-home.component';
import { CompanyNavbarComponent } from './components/company/company-navbar/company-navbar.component';
import { ImageSliderComponent } from './components/agent/image-slider/image-slider.component';

import { AuthenticationModule } from './authentication/authentication.module';
import { AuthService } from './authentication/auth.service';
import { JobOfferService } from './_services/job-offer.service';
import { ThemeService } from './services/theme.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JobOffersComponent,
    JobOfferDetailComponent,
    AboutComponent,
    ImageSliderComponent,
    CompanyHomeComponent,
    CompanyNavbarComponent,
    CreateOfferComponent,
    ManageOffersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    SharedModule,
    AuthenticationModule
  ],
  providers: [
    AuthService,
    JobOfferService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
