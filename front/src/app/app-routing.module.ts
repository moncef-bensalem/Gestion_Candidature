import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { JobOffersComponent } from './components/job-offers/job-offers.component';
import { JobOfferDetailComponent } from './components/job-offer-detail/job-offer-detail.component';
import { AboutComponent } from './components/about/about.component';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { CompanyHomeComponent } from './components/company/company-home/company-home.component';
import { CreateOfferComponent } from './components/company/create-offer/create-offer.component';
import { ManageOffersComponent } from './components/company/manage-offers/manage-offers.component';
import { VerifyCodeComponent } from './authentication/verify-code/verify-code.component';

const routes: Routes = [
  // Routes publiques
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  
  // Routes protégées pour les entreprises
  { 
    path: 'company',
    canActivate: [RoleGuard],
    data: { role: 'company' },
    children: [
      { path: 'home', component: CompanyHomeComponent },
      { path: 'create-offer', component: CreateOfferComponent },
      { path: 'manage-offers', component: ManageOffersComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
  // Routes protégées pour les agents
  { 
    path: 'agent',
    canActivate: [RoleGuard],
    data: { role: 'agent' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
  // Route pour les offres d'emploi
  { path: 'job-offers', component: JobOffersComponent },
  { path: 'job-offers/:id', component: JobOfferDetailComponent },
  
  // Route pour les agents
  { 
    path: 'agent',
    canActivate: [RoleGuard],
    data: { role: 'agent' },
    children: [
      { path: 'job-offers', component: JobOffersComponent },
      { path: 'job-offers/:id', component: JobOfferDetailComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  
  // Route par défaut
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
