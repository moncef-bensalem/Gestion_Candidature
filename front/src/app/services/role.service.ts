import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'agent' | 'company' | null;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentRoleSubject: BehaviorSubject<UserRole>;
  public currentRole: Observable<UserRole>;

  constructor() {
    this.currentRoleSubject = new BehaviorSubject<UserRole>(this.getStoredRole());
    this.currentRole = this.currentRoleSubject.asObservable();
  }

  public get currentRoleValue(): UserRole {
    return this.currentRoleSubject.value;
  }

  setRole(role: UserRole) {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
    this.currentRoleSubject.next(role);
  }

  private getStoredRole(): UserRole {
    const storedRole = localStorage.getItem('userRole') as UserRole;
    return storedRole;
  }

  clearRole() {
    localStorage.removeItem('userRole');
    this.currentRoleSubject.next(null);
  }

  isAgent(): boolean {
    return this.currentRoleValue === 'agent';
  }

  isCompany(): boolean {
    return this.currentRoleValue === 'company';
  }
}
