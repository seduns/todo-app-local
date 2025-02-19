import { Component, OnInit } from '@angular/core';
import { SideNavBarComponent } from "../side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SideNavBarComponent, NavBarComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  ngOnInit(): void {
    this.loadTodo();
  } 

  todos: { title: string, description: string, isComplete: boolean, submissionDate: string, state: string | null}[] = [];
  allTodos: { title: string, description: string, isComplete: boolean, submissionDate: string, state: string | null}[] = [];

  getTodoByState(state: string) {
    return this.todos.filter(todo => todo.state === state);
  }

  loadTodo(): void { 
    if (typeof window != 'undefined') { 
      const storedTodo = localStorage.getItem('todos');
      if (storedTodo) {
        this.todos = JSON.parse(storedTodo);
        this.allTodos = [...this.todos];
  
        console.log("Stored Todos:", this.todos);
        this.todos.forEach(todo => {
            console.log("Stored Date:", todo.submissionDate);
        });

      }
    }
  }
  
  showTodo: boolean = false;
  selectedIndex: number | null = null;
  selectedTitle: string | null = null;
  selectedDescription: string | null = null;
  selectedStateNew: string | null = null;
  selectedDateSubmission: string | null = null;
  selectedDate: string | null = null;

  openTodos(todo: any, index: number, event?: Event): void {
    if (event && event.target instanceof HTMLInputElement) {
        return;  // Do nothing if a radio button was clicked
    } 
    
    this.selectedIndex = index;
    this.selectedTitle = todo.title;
    this.selectedDescription = todo.description;
    this.selectedDateSubmission = todo.submissionDate;
    this.selectedStateNew = todo.state;
    this.showTodo = true;
  }

}
