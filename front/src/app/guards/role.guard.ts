import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role'] as 'agent' | 'company';
    const userType = localStorage.getItem('userType');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!requiredRole || !userType || !currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (userType === requiredRole) {
      return true;
    }

    // Rediriger vers la page de connexion si le rôle ne correspond pas
    this.router.navigate(['/login']);
    return false;
  }
}
