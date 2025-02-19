import { Component, OnInit } from '@angular/core';
import { SideNavBarComponent } from "../side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SideNavBarComponent, NavBarComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {

  todos: { title: string, description: string, isComplete: boolean, submissionDate: string}[] = [];
  allTodos: { title: string, description: string, isComplete: boolean, submissionDate: string}[] = [];

  constructor(private router : Router) {}

  ngOnInit(): void {
      this.loadTodo();
  } 

  showTodo: boolean = false;
  selectedIndex: number | null = null;
  selectedTitle: string | null = null;
  selectedDescription: string | null = null;
  selectedDateSubmission: string | null = null;
  selectedDate: string | null = null;

  loadTodo(): void { 
    if (typeof window != 'undefined') { 
      const storedTodo = localStorage.getItem('todos');
      if (storedTodo) {
        this.todos = JSON.parse(storedTodo);
        this.allTodos = [...this.todos];
  
        // console.log("Stored Todos:", this.todos);
        this.todos.forEach(todo => {
            // console.log("Stored Date:", todo.submissionDate);
        });

      }
    }
  }

  openTodos(todo: any, index: number, event?: Event): void {
    if (event && event.target instanceof HTMLInputElement) {
        return;  // Do nothing if a radio button was clicked
    }
    
    this.selectedIndex = index;
    this.selectedTitle = todo.title;
    this.selectedDescription = todo.description;
    this.selectedDateSubmission = todo.submissionDate;
    this.showTodo = true;
    
    }

  setComplete(index: number, event: Event): void {
    event.stopPropagation();  // Prevent event from bubbling up to the li element
  
    // Directly toggle the isComplete property for the clicked todo
    this.todos[index].isComplete = !this.todos[index].isComplete;

     // Save the updated todos to localStorage
      localStorage.setItem('todos', JSON.stringify(this.todos));
    
    this.loadTodo();
    console.log('Update', this.todos);
  }

  limitWords(description: string, limit: number = 10): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : description;
  }
}
