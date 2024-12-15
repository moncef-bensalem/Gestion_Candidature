import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  verifyForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  userType: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.verifyForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(): void {
    // Récupérer le type d'utilisateur depuis sessionStorage
    this.userType = sessionStorage.getItem('userType');
    console.log('User type from session:', this.userType);
    
    if (!this.userType) {
      console.error('No user type found in session');
      this.router.navigate(['/register']);
      return;
    }
  }

  get f() { return this.verifyForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log('Form submitted. User type:', this.userType);

    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    const code = parseInt(this.f['code'].value);

    if (this.userType === 'company') {
      console.log('Verifying company code:', code);
      this.authService.verifyCompanyCode(code).subscribe({
        next: () => {
          console.log('Company verification successful');
          sessionStorage.removeItem('userType');
          sessionStorage.removeItem('registrationCode');
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Company verification error:', error);
          this.error = error.error?.message || 'Erreur lors de la vérification du code';
          this.loading = false;
        }
      });
    } else if (this.userType === 'agent') {
      console.log('Verifying agent code:', code);
      this.authService.verifyAgentCode(code.toString()).subscribe({
        next: () => {
          console.log('Agent verification successful');
          sessionStorage.removeItem('userType');
          sessionStorage.removeItem('registrationCode');
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Agent verification error:', error);
          this.error = error.error?.message || 'Erreur lors de la vérification du code';
          this.loading = false;
        }
      });
    } else {
      console.error('Invalid user type:', this.userType);
      this.error = 'Type d\'utilisateur non reconnu';
      this.loading = false;
    }
  }
}
