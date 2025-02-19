import { Routes } from '@angular/router';
import { TodoAppComponent } from './todo-app/todo-app.component'; // Import your component
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
  { path: 'todo', component: TodoAppComponent }, // Define your route
  { path: 'home', component: HomepageComponent }, // Define your route
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect empty path to 'todo'
  { path: '**', redirectTo: 'home', pathMatch: 'full' } // Redirect empty path to 'todo'
];
