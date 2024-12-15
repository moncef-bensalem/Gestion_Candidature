import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  userType: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToJobOffers() {
    this.router.navigate(['/agent/job-offers']);
  }
}
