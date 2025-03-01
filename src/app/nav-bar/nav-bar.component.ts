import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faC, faHome, faListCheck, faTableList } from '@fortawesome/free-solid-svg-icons';


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

  ngOnInit(): void {
      
  }

isToggleNav: boolean = false;

toggleNav(): void { 
  this.isToggleNav = !this.isToggleNav;
  console.log('Toggle: ' + this.isToggleNav);
}


}
