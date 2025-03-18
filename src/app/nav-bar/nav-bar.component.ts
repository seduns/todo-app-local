import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faC, faHome, faListCheck, faMoon, faSlash, faSun, faTableList } from '@fortawesome/free-solid-svg-icons';
import { truncateSync } from 'node:fs';
import { NavStateService } from './service/nav-state.service';
import { BehaviorSubject } from 'rxjs';
import { BackgrondModeService } from './service/backgrond-mode.service';
import { isDeepStrictEqual } from 'node:util';


@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  faHome = faHome;
  faTableList = faTableList;
  faListCheck = faListCheck;
  isMinimizeNav: boolean = false;
  faMoon = faMoon;
    faSun = faSun;

  @Input() isNavHidden: boolean = false; 

  isDarkMode: boolean = false;

  constructor(private navStateService: NavStateService, private backgroundMode: BackgrondModeService) {
    this.isDarkMode = this.backgroundMode.isDarkMode();

  }

  ngOnInit(): void {
    this.navStateService.isNavHidden$.subscribe(state => {
      this.isNavHidden = state;
    });
  }

  isToggleNav: boolean = false;

  toggleNav() {
    this.navStateService.toggleNav(); 
  }

  toggleDarkMode(): void {
    this.backgroundMode.toggleDarkMode();
    this.isDarkMode = this.backgroundMode.isDarkMode();
  }

}
