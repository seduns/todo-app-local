import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAnglesLeft, faAnglesRight, faArrowRight, faCoffee, faHome, faListCheck, faTableList } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-side-nav-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
    templateUrl: './side-nav-bar.component.html',
    styleUrls: ['./side-nav-bar.component.scss'] // <-- Corrected here
})
export class SideNavBarComponent implements OnInit {
  
  faCoffee = faCoffee;
  faHome = faHome;
  faTableList = faTableList;
  faListCheck = faListCheck;
  faAngleLeft = faAnglesLeft;
  faAngleRight = faAnglesRight;

  isMinimizeNav: boolean | null = null; // Initialize as null to handle loading state
  private readonly NAV_STATE_KEY = 'isMinimizeNav';
  
  ngOnInit(): void {
    if (typeof window != 'undefined') { 
      const storedState = localStorage.getItem(this.NAV_STATE_KEY);
      this.isMinimizeNav = storedState === 'true';
    }
  }

  minimizeNav(): void { 
    
      this.isMinimizeNav = !this.isMinimizeNav;
      console.log('Close Nav: ' + this.isMinimizeNav);

      // Persist state to localStorage
      localStorage.setItem(this.NAV_STATE_KEY, this.isMinimizeNav.toString());

  } 
}
