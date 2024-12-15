import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDarkTheme$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private themeService: ThemeService
  ) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  ngOnInit(): void {
  }

  getUserType(): string {
    const user = this.authService.currentUserValue;
    return user?.userType || '';
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Vous avez été déconnecté avec succès');
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}