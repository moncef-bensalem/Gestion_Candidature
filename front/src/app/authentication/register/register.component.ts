import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

interface RegisterResponse {
  code: string;
  message: string;
}

interface ErrorResponse {
  error: {
    message: string;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  userType: 'agent' | 'company' = 'agent';
  showVerificationForm = false;
  verificationCode: string = '';
  generatedCode: string = '';
  tempUserData: any = null;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'passwordMismatch': true };
  }

  onUserTypeChange(type: 'agent' | 'company'): void {
    this.userType = type;
    this.initializeForm();
  }

  initializeForm(): void {
    if (this.userType === 'agent') {
      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
      }, {
        validator: this.passwordMatchValidator
      });
    } else {
      this.registerForm = this.formBuilder.group({
        login: ['', [Validators.required, Validators.minLength(3)]],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        imageUrl: [''],
      }, {
        validator: this.passwordMatchValidator
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    if (this.userType === 'company') {
      this.authService.registerCompany(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Company registration successful:', response);
          sessionStorage.setItem('userType', 'company');
          sessionStorage.setItem('registrationCode', response.code);
          this.router.navigate(['/verify-code']);
          this.loading = false;
        },
        error: error => {
          console.error('Company registration error:', error);
          this.error = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.loading = false;
        }
      });
    } else {
      this.authService.registerAgent(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Agent registration successful:', response);
          sessionStorage.setItem('userType', 'agent');
          sessionStorage.setItem('registrationCode', response.code);
          this.router.navigate(['/verify-code']);
          this.loading = false;
        },
        error: error => {
          console.error('Agent registration error:', error);
          this.error = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.loading = false;
        }
      });
    }
  }
}
