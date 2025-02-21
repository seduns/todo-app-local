import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faHome, faListCheck, faTableList } from '@fortawesome/free-solid-svg-icons';
import { NavStateServiceService } from './service/nav-state-service.service';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'] // <-- Corrected here
})
export class SideNavBarComponent implements OnInit {

  faCoffee = faCoffee;
  faHome = faHome;
  faTableList = faTableList;
  faListCheck = faListCheck;

  isMinimizeNav: boolean = false;

  constructor(private navStateService: NavStateServiceService) {}

  ngOnInit(): void {
    this.isMinimizeNav = this.navStateService.isMinimizeNav;
    console.log('Minimize: ' + this.isMinimizeNav);
  }

  minimizeNav(): void { 
    this.isMinimizeNav = !this.isMinimizeNav;
    this.navStateService.isMinimizeNav = this.isMinimizeNav;
    console.log('Close Nav: ' + this.isMinimizeNav);
  } 
}
