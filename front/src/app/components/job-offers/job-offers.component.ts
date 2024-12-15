import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobOfferService, JobOffer, JobApplication } from '../../_services/job-offer.service';
import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

interface ApplicationMap {
  [key: number]: JobApplication[];
}

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html'
})
export class JobOffersComponent implements OnInit {
  offers: JobOffer[] = [];
  pendingOffers: JobOffer[] = [];
  applications: ApplicationMap = {};
  loading = false;
  error = '';
  userType: string | null = null;
  showModal = false;
  selectedOffer: JobOffer | null = null;
  applicationForm: FormGroup;
  submitted = false;
  private modalInstance: any;

  constructor(
    private jobOfferService: JobOfferService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    const currentUser = this.authService.currentUserValue;
    this.userType = currentUser?.userType ?? null;
    this.applicationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  get f() {
    return this.applicationForm.controls;
  }

  loadOffers() {
    this.loading = true;
    this.jobOfferService.getAllOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.pendingOffers = this.offers.filter(offer => offer.status === 'Pending');
        if (this.canManageApplications()) {
          this.loadApplicationsForOffers();
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Erreur lors du chargement des offres';
        this.loading = false;
        this.toastr.error(this.error);
      }
    });
  }

  loadApplicationsForOffers() {
    this.pendingOffers.forEach(offer => {
      this.jobOfferService.getApplicationsForOffer(offer.id).subscribe({
        next: (applications) => {
          this.applications[offer.id] = applications;
        },
        error: (error: any) => {
          console.error(`Error loading applications for offer ${offer.id}:`, error);
          this.toastr.error(`Erreur lors du chargement des candidatures pour l'offre ${offer.id}`);
        }
      });
    });
  }

  canManageApplications(): boolean {
    return this.userType === 'COMPANY';
  }

  openApplicationModal(offer: JobOffer) {
    this.selectedOffer = offer;
    this.submitted = false;
    this.applicationForm.reset();
    
    
    // Utiliser l'API Bootstrap pour ouvrir le modal
    const modalEl = document.getElementById('applicationModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.selectedOffer = null;
    this.submitted = false;
    this.applicationForm.reset();
  }

  submitApplication() {
    this.submitted = true;

    if (this.applicationForm.invalid || !this.selectedOffer) {
      return;
    }

    this.loading = true;
    const applicationData: Partial<JobApplication> = {
      ...this.applicationForm.value,
      jobOfferId: this.selectedOffer.id,
      status: 'PENDING'
    };

    this.jobOfferService.submitApplication(applicationData).subscribe({
      next: () => {
        this.toastr.success('Candidature envoyée avec succès');
        this.closeModal();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Erreur lors de l\'envoi de la candidature';
        this.toastr.error(this.error);
        this.loading = false;
      }
    });
  }
}
