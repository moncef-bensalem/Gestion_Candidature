import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://localhost:8081/offer';  // Mise à jour du port à 8081

  constructor(private http: HttpClient) { }

  getAllOffers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getOfferById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createOffer(offerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, offerData);
  }

  acceptOffer(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${id}`, {});
  }

  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
