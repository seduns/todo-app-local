import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SideNavBarComponent } from "./side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SideNavBarComponent, NavBarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todoApp';
}
