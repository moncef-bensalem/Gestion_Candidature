import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-company-navbar',
  templateUrl: './company-navbar.component.html',
  styleUrls: ['./company-navbar.component.css']
})
export class CompanyNavbarComponent {
  isDarkTheme$: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private toastr: ToastrService
  ) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Déconnexion réussie');
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
