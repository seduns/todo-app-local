import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAnglesLeft, faAnglesRight, faArrowsToEye, faChevronDown, faChevronRight, faCoffee, faEye, faHome, faList12, faListCheck, faNotesMedical, faNoteSticky, fas, faTableList } from '@fortawesome/free-solid-svg-icons';
import { NavStateService } from '../nav-bar/service/nav-state.service';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {

  // FontAwesome icons
  faCoffee = faCoffee;
  faHome = faHome;
  faTableList = faTableList;
  faList12 = faList12;
  faListCheck = faListCheck;
  faAngleLeft = faAnglesLeft;
  faAngleRight = faAnglesRight;
  faChevronDown = faChevronDown;
  faChevronRight = faChevronRight;
  faEye = faEye;
  faNote = faNoteSticky;

  constructor(private navStateService: NavStateService) {
    this.navStateService.isNavHidden$.subscribe(state => this.isNavHide = state);
  }

  // Define nav link type directly within the class
  navLinks: { 
    path?: string;
    label: string;
    icon: any;
    isExpanded?: boolean;
    children?: { path: string; label: string; icon: any }[];
  }[] = [
    { 
      path: '/home', 
      label: 'Home',
      icon: faHome, 
    },
    { 
      label: 'My Task',
      icon: this.faListCheck, 
      isExpanded: false,
      children: [
        { path: '/todo', label: 'Task', icon: faList12 },
        // { path: '/note', label: 'Note', icon: faNoteSticky },
      ]
    },
    { 
      path: '/board', 
      label: 'Board',
      icon: faTableList, 
    }
  ];

  // State variables
  isMinimizeNav: boolean | null = null;
  private readonly NAV_STATE_KEY = 'isMinimizeNav';
  private readonly NAV_STATE_KEY_CHILD = 'isExpanded';
  private readonly NAV_STATE_KEY_HIDE = 'isNavHide';

  ngOnInit(): void {
    if (typeof window !== 'undefined') { 
      const storedState = localStorage.getItem(this.NAV_STATE_KEY);
      this.isMinimizeNav = storedState === 'true';

      // Load submenu state
      this.navLinks.forEach(link => {
        if (link.children) {
          const storedExpanded = localStorage.getItem(`${this.NAV_STATE_KEY_CHILD}_${link.label}`);
          link.isExpanded = storedExpanded === 'true';
        }
      });
      
      this.navStateService.isNavHidden$.subscribe(state => {
        this.isNavHidden = state;
      });
      
      const hideState = localStorage.getItem(this.NAV_STATE_KEY_HIDE);
      this.isNavHide = hideState === 'true';
    }
  }

  toggleSubmenu(link: any, event: Event): void {
    event.stopPropagation();
    if (link.children) {
      link.isExpanded = !link.isExpanded;
      localStorage.setItem(`${this.NAV_STATE_KEY_CHILD}_${link.label}`, link.isExpanded.toString());
    }
  }

  minimizeNav(): void { 
    this.isMinimizeNav = !this.isMinimizeNav;
    localStorage.setItem(this.NAV_STATE_KEY, this.isMinimizeNav.toString());
  } 
  
  @Input() isNavHidden: boolean = false;
  isNavHide: boolean = false;

  hideSideNav(): void { 
    this.navStateService.toggleNav(); // Toggle state in service

    localStorage.setItem(this.NAV_STATE_KEY_HIDE, this.isNavHide.toString());
  }
}
