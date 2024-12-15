import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
})
export class ManageOffersComponent implements OnInit {
  offers: any[] = [];
  loading = false;
  error = '';

  constructor(private offerService: OfferService) { }

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.loading = true;
    this.offerService.getAllOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des offres';
        this.loading = false;
      }
    });
  }

  acceptOffer(id: number) {
    this.offerService.acceptOffer(id).subscribe({
      next: () => {
        this.loadOffers(); // Recharger la liste après acceptation
      },
      error: (error) => {
        this.error = 'Erreur lors de l\'acceptation de l\'offre';
      }
    });
  }

  deleteOffer(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.offerService.deleteOffer(id).subscribe({
        next: () => {
          this.loadOffers(); // Recharger la liste après suppression
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression de l\'offre';
        }
      });
    }
  }
}
