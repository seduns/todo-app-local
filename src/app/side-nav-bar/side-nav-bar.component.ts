import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faHome, faListCheck, faTableList } from '@fortawesome/free-solid-svg-icons';

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
  isMinimizeNav: boolean = false;
  
  ngOnInit(): void {
  }

  minimizeNav(): void { 
    if (this.isMinimizeNav) {
       console.log('open nav');
    }
      this.isMinimizeNav = !this.isMinimizeNav;
      console.log('Close Nav: ' + this.isMinimizeNav);
  } 
}
