import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  email: string;
  type: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  login(email: string, password: string, userType: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const payload = {
      login: email,
      password: password,
      type: userType.toLowerCase()
    };

    return this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, payload, httpOptions)
      .pipe(map(response => {
        if (response && response.token) {
          const user = {
            email: email,
            type: userType,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }
        throw new Error('Login failed');
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  register(userData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${environment.apiUrl}/auth/register`, userData, httpOptions);
  }

  registerAgent(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/agent/register`, data);
  }

  registerCompany(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/company/register`, data);
  }

  verifyAgentCode(code: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${environment.apiUrl}/agent/verify-code`, { code }, httpOptions);
  }

  verifyCompanyCode(code: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${environment.apiUrl}/company/verify-code`, { code }, httpOptions);
  }
}
