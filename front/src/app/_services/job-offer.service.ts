import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  company: string;
  salary: number;
  location: string;
  publishDate: Date;
  degree: string;
  status: string;
  requiredSkills?: string[];
  contractType?: string;
}

export interface JobApplication {
  id: number;
  jobOfferId: number;
  userId: number;
  applicationDate: Date;
  status: string;
  name: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = `${environment.apiUrl}/offer`;

  constructor(private http: HttpClient) {}

  getAllOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/all`);
  }

  getOfferById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
  }

  createOffer(offerData: Partial<JobOffer>): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/create`, offerData);
  }

  getApplicationsForOffer(offerId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/${offerId}/applications`);
  }

  submitApplication(applicationData: Partial<JobApplication>): Observable<JobApplication> {
    const offerId = applicationData.jobOfferId;
    return this.http.post<JobApplication>(`${this.apiUrl}/${offerId}/apply`, applicationData);
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${applicationId}/status`, { status });
  }
}
