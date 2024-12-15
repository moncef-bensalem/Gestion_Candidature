import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyStatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProfilesCount(): Observable<number> {
    const endpoint = `${this.apiUrl}/api/v1/profile/all`;
    console.log('Calling profiles endpoint:', endpoint);
    return this.http.get<any[]>(endpoint).pipe(
      tap(profiles => console.log('Received profiles:', profiles)),
      map(profiles => profiles.length),
      tap(count => console.log('Profile count:', count))
    );
  }

  getOffersCount(): Observable<number> {
    const endpoint = `${this.apiUrl}/api/v1/jobOffer/all`;
    console.log('Calling offers endpoint:', endpoint);
    return this.http.get<any[]>(endpoint).pipe(
      tap(offers => console.log('Received offers:', offers)),
      map(offers => offers.length),
      tap(count => console.log('Offers count:', count))
    );
  }

  getNewOffersCount(): Observable<number> {
    const endpoint = `${this.apiUrl}/api/v1/jobOffer/all`;
    console.log('Calling new offers endpoint:', endpoint);
    return this.http.get<any[]>(endpoint).pipe(
      tap(offers => console.log('Received offers for new count:', offers)),
      map(offers => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return offers.filter(offer => new Date(offer.createdAt) >= oneWeekAgo).length;
      }),
      tap(count => console.log('New offers count:', count))
    );
  }
}
