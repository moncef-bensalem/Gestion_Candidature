import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
})
export class CreateOfferComponent implements OnInit {
  offerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private offerService: OfferService,
    private router: Router
  ) {
    this.offerForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      degree: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      profileId: ['', Validators.required],
      companyId: [''] // This will be set from the logged-in company's data
    });
  }

  ngOnInit() {
    // Get the company ID from localStorage or your auth service
    const companyData = JSON.parse(localStorage.getItem('user') || '{}');
    if (companyData && companyData.id) {
      this.offerForm.patchValue({
        companyId: companyData.id
      });
    }
  }

  onSubmit() {
    if (this.offerForm.invalid) {
      return;
    }

    this.loading = true;
    this.offerService.createOffer(this.offerForm.value)
      .subscribe({
        next: () => {
          this.loading = false;
          console.log('Offre créée avec succès, redirection...');
          this.router.navigate(['/company/manage-offers']).then(
            () => console.log('Navigation réussie'),
            err => console.error('Erreur de navigation:', err)
          );
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.loading = false;
        }
      });
  }
}
