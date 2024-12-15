import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../authentication/services/auth.service';

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  location: string;
  degree: string;
  salary: number;
  profileId: number;
  companyId: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface JobApplication {
  id: number;
  offerId: number;
  userId: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  applicationDate: Date;
}

export interface CreateJobOfferRequest {
  title: string;
  description: string;
  location: string;
  degree: string;
  salary: number;
  profileId: number;
  companyId: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = `${environment.apiUrl}/offer`;
  private applicationUrl = `${environment.apiUrl}/application`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Méthodes pour les offres d'emploi
  getAllOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/all`);
  }

  getOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
  }

  createOffer(offer: CreateJobOfferRequest): Observable<string> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.type !== 'company') {
      throw new Error('Seules les entreprises peuvent créer des offres');
    }
    return this.http.post<string>(`${this.apiUrl}/create`, offer);
  }

  // Méthodes pour les candidatures
  getApplicationsForOffer(offerId: number): Observable<JobApplication[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || (currentUser.type !== 'company' && currentUser.type !== 'agent')) {
      throw new Error('Accès non autorisé');
    }
    return this.http.get<JobApplication[]>(`${this.applicationUrl}/offer/${offerId}`);
  }

  applyToOffer(offerId: number): Observable<string> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Vous devez être connecté pour postuler');
    }
    return this.http.post<string>(`${this.applicationUrl}/apply/${offerId}`, {});
  }

  handleApplication(applicationId: number, status: 'Accepted' | 'Rejected'): Observable<string> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || (currentUser.type !== 'company' && currentUser.type !== 'agent')) {
      throw new Error('Vous n\'avez pas les droits pour gérer les candidatures');
    }
    return this.http.put<string>(`${this.applicationUrl}/${applicationId}/${status.toLowerCase()}`, {});
  }

  // Pour les entreprises uniquement
  deleteOffer(offerId: number): Observable<string> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.type !== 'company') {
      throw new Error('Seules les entreprises peuvent supprimer des offres');
    }
    return this.http.delete<string>(`${this.apiUrl}/delete/${offerId}`);
  }
}
