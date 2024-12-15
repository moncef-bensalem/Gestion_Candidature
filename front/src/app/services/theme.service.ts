import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme) {
      const isDark = savedTheme === 'true';
      this.isDarkTheme.next(isDark);
      this.updateTheme(isDark);
    }

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('darkTheme')) {
        const isDark = e.matches;
        this.isDarkTheme.next(isDark);
        this.updateTheme(isDark);
      }
    });
  }

  toggleTheme() {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    localStorage.setItem('darkTheme', newTheme.toString());
    this.updateTheme(newTheme);
  }

  private updateTheme(isDark: boolean) {
    const html = document.documentElement;
    if (isDark) {
      this.renderer.addClass(html, 'dark-theme');
    } else {
      this.renderer.removeClass(html, 'dark-theme');
    }
  }
}
