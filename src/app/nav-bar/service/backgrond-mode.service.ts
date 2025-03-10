import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgrondModeService {
  private darkModeEnabled = false;

  constructor() {
    // Load dark mode preference from localStorage
    if (typeof window != 'undefined' ) { 
      this.darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      this.updateTheme();
    }
  }

  toggleDarkMode(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    localStorage.setItem('darkMode', String(this.darkModeEnabled)); // Save preference
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.darkModeEnabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  isDarkMode(): boolean {
    return this.darkModeEnabled;
  }
}
