import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Connexion (pour les deux types d'utilisateurs)
  login(credentials: { login: string; password: string; type: 'agent' | 'company' }): Observable<any> {
    console.log('Service Auth - Tentative de connexion:', credentials);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/authenticate`, credentials)
      .pipe(
        map(response => {
          console.log('Service Auth - Réponse du serveur:', response);
          if (response && response.token) {
            const user = {
              login: credentials.login,
              type: credentials.type,
              token: response.token
            };
            console.log('Service Auth - Stockage des informations utilisateur:', user);
            
            // Stockage des informations dans le localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('userType', credentials.type);
            
            // Mise à jour du BehaviorSubject
            this.currentUserSubject.next(user);
            
            console.log('Service Auth - Type utilisateur stocké:', credentials.type);
            return user;
          }
          throw new Error('Token non reçu du serveur');
        })
      );
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
  }

  // Inscription d'un agent
  registerAgent(agent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/register`, agent)
      .pipe(
        tap(response => {
          console.log('Agent registration response:', response);
        }),
        catchError(error => {
          console.error('Agent registration error:', error);
          return throwError(() => error);
        })
      );
  }

  // Vérification du code pour un agent
  verifyAgentCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/verify-code`, { code })
      .pipe(
        tap(response => {
          console.log('Agent verification response:', response);
        }),
        catchError(error => {
          console.error('Agent verification error:', error);
          return throwError(() => error);
        })
      );
  }

  verifyAgent(agent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/verify`, agent)
      .pipe(
        tap(response => {
          console.log('Agent verification response:', response);
        }),
        catchError(error => {
          console.error('Agent verification error:', error);
          return throwError(() => error);
        })
      );
  }

  // Inscription d'une entreprise
  registerCompany(company: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/company/register`, company)
      .pipe(
        tap(response => {
          console.log('Company registration response:', response);
        }),
        catchError(error => {
          console.error('Company registration error:', error);
          return throwError(() => error);
        })
      );
  }

  // Vérification du code pour une entreprise
  verifyCompanyCode(code: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/company/verify-code`, { code })
      .pipe(
        tap(response => {
          console.log('Company verification response:', response);
        }),
        catchError(error => {
          console.error('Company verification error:', error);
          return throwError(() => error);
        })
      );
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Obtenir le type d'utilisateur
  getUserType(): 'agent' | 'company' | null {
    const userType = localStorage.getItem('userType');
    console.log('Service Auth - Type utilisateur récupéré:', userType);
    return userType as 'agent' | 'company' | null;
  }
}
