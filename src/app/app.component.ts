import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SideNavBarComponent } from "./side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { faSlash } from '@fortawesome/free-solid-svg-icons';
import { NavStateService } from './nav-bar/service/nav-state.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SideNavBarComponent, NavBarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'todoApp';

  isNavHide: boolean = false;

  isNavHidden: boolean = false;

  constructor(private navStateService: NavStateService) {
    this.navStateService.isNavHidden$.subscribe(state => {
      this.isNavHidden = state;
    });
  }
 
}
