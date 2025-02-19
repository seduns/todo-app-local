import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {


  ngOnInit(): void {
      
  }

isToggleNav: boolean = false;

toggleNav(): void { 
  this.isToggleNav = !this.isToggleNav;
  console.log('Toggle: ' + this.isToggleNav);
}


}
