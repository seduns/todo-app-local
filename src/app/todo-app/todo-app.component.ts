import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BlobOptions } from 'buffer';
import { TypeModifier } from '@angular/compiler';
import { filter } from 'rxjs';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { SideNavBarComponent } from "../side-nav-bar/side-nav-bar.component";
import { secureHeapUsed } from 'crypto';
import { state } from '@angular/animations';
import { getSymbolIterator } from 'rxjs/internal/symbol/iterator';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, SideNavBarComponent],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit {

  constructor() {
   
  }

  title: string = '';
  description: string = '';
  selectState: string = 'new';
  isComplete: boolean = false;
  submissionDate: string | null = null;

  todos: { title: string, description: string, isComplete: boolean, submissionDate: string, state: string | null}[] = [];
  allTodos: { title: string, description: string, isComplete: boolean, submissionDate: string, state: string | null}[] = [];

  ngOnInit(): void {
    this.loadTodo();

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

  onDateChange(): void {
    console.log('Selected Date: ', this.selectedDate);
    this.filteredTodo();
  }

  onStateChange(): void { 
    this.selectState = this.selectState;
    console.log('State: ', this.selectState);
  }

  filteredTodo(): void {
    if (!this.selectedDate) {
      this.todos = [...this.allTodos]; // Reset to all todos
      return;
    }
  
    const selectedDateString = new Date(this.selectedDate).toLocaleDateString(); // Convert selected date to local format
  
    this.todos = this.allTodos.filter((todo) => {
      const filterDate = new Date(todo.submissionDate).toLocaleDateString(); // Convert stored date to local format
      console.log(`Comparing: ${filterDate} === ${selectedDateString}`); // Log comparison
      return filterDate === selectedDateString; // Compare both formatted dates
    });
  
    console.log(this.todos);
  }

  getTodoByState(state: string) {
    return this.todos.filter(todo => todo.state === state);
  }
  
  submit(): void {
    if (this.title && this.description && this.selectState) {
      this.todos.push({ title: this.title, description: this.description, isComplete: this.isComplete, submissionDate: new Date().toLocaleString(), state:  this.selectState });  // Add the todo as an object.
      if (typeof window !== 'undefined') {  // Ensure localStorage is available.
        localStorage.setItem('todos', JSON.stringify(this.todos));  // Save the updated list to localStorage.
      }
      console.log('New todo added: ', this.title);
      alert('New todo added');
      this.loadTodo();
      this.title = '';  // Clear the input field after submission.
      this.description = '';  // Clear the description field.
      this.selectState = 'new';
      this.isAddTask = false;
    } 
    else {
      alert('Complete all the form!');
    }
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
  
  delete(index: number, event: Event): void {
    event.stopPropagation();
    this.todos.splice(index, 1);  // Remove the todo item at the specified index.
    if (typeof window !== 'undefined') {  // Ensure localStorage is available.
      localStorage.setItem('todos', JSON.stringify(this.todos));  // Update localStorage.
    }
    console.log('Todo deleted');
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


  saveEdit(): void { 
    if ( this.selectedIndex !== null && this.selectedTitle && this.selectedDescription && this.selectedStateNew ){
      this.todos[this.selectedIndex] = {
        title: this.selectedTitle,
        description: this.selectedDescription,
        isComplete: this.todos[this.selectedIndex].isComplete,
        state: this.selectedStateNew,
        submissionDate: new Date().toLocaleString()
      };
      alert('Update Success');
      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.loadTodo();
      this.selectedDateSubmission = new Date().toLocaleString(); 

    } else {
      alert('Complete all the fields');
      console.log('New title: ' + this.selectedTitle);
      console.log('New description:  ' + this.selectedDescription);
      console.log('New state: ' + this.selectedStateNew);
      
    }
  }

  isEditTodo: boolean = false;

  editTodo(): void {
    this.isEditTodo = !this.isEditTodo;
    // alert('edit todo');
  }
 
  closeTodos(): void {
    this.showTodo = false;
    this.isEditTodo = false;
  }

  isAddTask: boolean = false;

  addTask(): void {
    this.isAddTask = true;
  }

  closeAddTask(): void {
    this.isAddTask = false;
    this.title = '';
    this.description = '';
  }
}
