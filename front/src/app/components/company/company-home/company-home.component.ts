import { Component, OnInit } from '@angular/core';
import { CompanyStatsService } from '../../../_services/company-stats.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.css']
})
export class CompanyHomeComponent implements OnInit {
  totalProfiles: number = 7;
  totalOffers: number = 5;
  newOffers: number = 4;
  loading: boolean = true;

  constructor(
    private companyStatsService: CompanyStatsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;
    
    // Utiliser forkJoin pour faire toutes les requêtes en parallèle
    forkJoin({
      profiles: this.companyStatsService.getProfilesCount(),
      offers: this.companyStatsService.getOffersCount(),
      newOffers: this.companyStatsService.getNewOffersCount()
    }).subscribe({
      next: (data) => {
        this.totalProfiles = data.profiles;
        this.totalOffers = data.offers;
        this.newOffers = data.newOffers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.toastr.error('Erreur lors du chargement des statistiques');
        this.loading = false;
      }
    });
  }
}
