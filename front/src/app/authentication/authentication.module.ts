import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    VerifyCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthenticationModule { }
