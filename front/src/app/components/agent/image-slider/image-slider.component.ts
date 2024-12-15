import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {
  images = [
    {
      url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
      title: 'Trouvez les meilleurs talents',
      description: 'Accédez à une large base de candidats qualifiés'
    },
    {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
      title: 'Gestion simplifiée des offres',
      description: 'Gérez vos offres d\'emploi en toute simplicité'
    },
    {
      url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
      title: 'Recrutement efficace',
      description: 'Optimisez votre processus de recrutement'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('Slider initialisé avec les images:', this.images);
  }
}
