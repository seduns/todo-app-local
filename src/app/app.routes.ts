import { Routes } from '@angular/router';
import { TodoAppComponent } from '../todo-app/todo-app.component'; // Import your component

export const routes: Routes = [
  { path: 'todo', component: TodoAppComponent }, // Define your route
  { path: '', redirectTo: 'todo', pathMatch: 'full' }, // Redirect empty path to 'todo'
  { path: '**', redirectTo: 'todo', pathMatch: 'full' } // Redirect empty path to 'todo'
];
