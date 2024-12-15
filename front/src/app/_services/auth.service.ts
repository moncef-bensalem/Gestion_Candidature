import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  userType: string;
  token?: string;
}

export interface AgentRegisterRequest {
  email: string;
  password: string;
}

export interface CompanyRegisterRequest {
  login: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  registerAgent(data: AgentRegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/register`, data);
  }

  registerCompany(data: CompanyRegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/company/register`, data);
  }

  verifyAgentCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/verify`, { code });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }
}
