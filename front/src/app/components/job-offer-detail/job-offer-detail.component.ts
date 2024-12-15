import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobOfferService, JobOffer, JobApplication } from '../../_services/job-offer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-offer-detail',
  templateUrl: './job-offer-detail.component.html',
  styleUrls: ['./job-offer-detail.component.css']
})
export class JobOfferDetailComponent implements OnInit {
  offer: JobOffer | null = null;
  isApplied: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const offerId = this.route.snapshot.params['id'];
    this.loadOfferDetails(offerId);
  }

  loadOfferDetails(offerId: number) {
    this.jobOfferService.getOfferById(offerId).subscribe({
      next: (offer) => {
        this.offer = offer;
      },
      error: (error: any) => {
        console.error('Error loading offer details:', error);
        this.toastr.error('Erreur lors du chargement des détails de l\'offre');
      }
    });
  }

  applyToOffer() {
    if (!this.offer) return;
    
    const applicationData: Partial<JobApplication> = {
      jobOfferId: this.offer.id,
      status: 'PENDING'
    };

    this.jobOfferService.submitApplication(applicationData).subscribe({
      next: (response: JobApplication) => {
        this.isApplied = true;
        this.toastr.success('Votre candidature a été envoyée avec succès');
      },
      error: (error: any) => {
        console.error('Error applying to offer:', error);
        this.toastr.error('Erreur lors de l\'envoi de votre candidature');
      }
    });
  }
}
