import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    // Rediriger si déjà connecté
    if (this.authService.currentUserValue) {
      this.redirectBasedOnUserType();
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userType: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials = {
      login: this.f['login'].value,
      password: this.f['password'].value,
      type: this.f['userType'].value
    };

    console.log('Tentative de connexion avec:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Réponse de connexion:', response);
        if (response && response.token) {
          this.toastr.success('Connexion réussie');
          this.loading = false;
          this.redirectBasedOnUserType();
        } else {
          this.toastr.error('Erreur lors de la connexion');
          this.loading = false;
        }
      },
      error: error => {
        console.error('Erreur de connexion:', error);
        this.toastr.error(error.error?.message || 'Erreur de connexion');
        this.loading = false;
      }
    });
  }

  private redirectBasedOnUserType() {
    const userType = this.authService.getUserType();
    console.log('Type d\'utilisateur pour redirection:', userType);
    
    if (userType === 'company') {
      console.log('Redirection vers l\'espace entreprise');
      this.router.navigate(['/company/home']).then(
        () => {
          console.log('Navigation réussie vers l\'espace entreprise');
          this.toastr.success('Bienvenue dans votre espace entreprise');
        },
        err => {
          console.error('Erreur de navigation:', err);
          this.toastr.error('Erreur lors de la redirection');
        }
      );
    } else if (userType === 'agent') {
      console.log('Redirection vers l\'espace agent');
      this.router.navigate(['/agent/home']).then(
        () => {
          console.log('Navigation réussie vers l\'espace agent');
          this.toastr.success('Bienvenue dans votre espace agent');
        },
        err => {
          console.error('Erreur de navigation:', err);
          this.toastr.error('Erreur lors de la redirection');
        }
      );
    } else {
      console.error('Type d\'utilisateur non reconnu:', userType);
      this.toastr.error('Type d\'utilisateur non reconnu');
      this.router.navigate(['/login']);
    }
  }
}
