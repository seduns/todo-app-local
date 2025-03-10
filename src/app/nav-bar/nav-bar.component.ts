import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faC, faHome, faListCheck, faTableList } from '@fortawesome/free-solid-svg-icons';
import { truncateSync } from 'node:fs';
import { NavStateService } from './service/nav-state.service';
import { BehaviorSubject } from 'rxjs';


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

  @Input() isNavHidden: boolean = false; // ✅ Receive state from parent

  constructor(private navStateService: NavStateService) {}

  ngOnInit(): void {
    // ✅ Subscribe to the nav state to update UI when it changes
    this.navStateService.isNavHidden$.subscribe(state => {
      this.isNavHidden = state;
    });
  }

  isToggleNav: boolean = false;

  toggleNav() {
    this.navStateService.toggleNav(); // ✅ Toggle state globally
  }

}
