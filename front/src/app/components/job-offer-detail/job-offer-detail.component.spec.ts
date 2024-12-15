import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferDetailComponent } from './job-offer-detail.component';

describe('JobOfferDetailComponent', () => {
  let component: JobOfferDetailComponent;
  let fixture: ComponentFixture<JobOfferDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOfferDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
