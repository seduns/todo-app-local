import { Component, OnInit } from '@angular/core';
import { SideNavBarComponent } from "../side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../model/todo.mode';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SideNavBarComponent, NavBarComponent, CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  ngOnInit(): void {
    this.loadTodo();
  } 

   todos:Todo[] =[] ;
   allTodos: Todo[] =[];

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
  selectedId: number | null = null;
  selectedTitle: string | null = null;
  selectedDescription: string | null = null;
  selectedStateNew: string | null = null;
  selectedLevelNew: string | null = null;
  selectedLevel: string | null = null;
  selectedDateSubmission: string | null = null;
  selectedDate: string | null = null;

  openTodos(todo: Todo, index: number): void {
    if (event && event.target instanceof HTMLInputElement) {
        return;  // Do nothing if a radio button was clicked
    } 
    console.log('Selected todo id: ' + todo.todoId);
    this.selectedId = todo.todoId;  
    this.selectedIndex = index;
    this.selectedTitle = todo.title;
    this.selectedDescription = todo.description;
    this.selectedDateSubmission = todo.submissionDate;
    this.selectedStateNew = todo.state;
    this.selectedLevelNew = todo.level;
    this.showTodo = true;
  }

  saveEdit(): void { 
    if ( this.selectedId !== null && this.selectedTitle && this.selectedDescription && this.selectedStateNew && this.selectedLevelNew ){
      
      const todoIndex = this.todos.findIndex(todo => todo.todoId === this.selectedId);

      if (todoIndex !== -1) { 
        this.todos[todoIndex] = {
          todoId: this.selectedId,
          title: this.selectedTitle,
          description: this.selectedDescription,
          isComplete: this.todos[todoIndex].isComplete,
          state: this.selectedStateNew,
          level: this.selectedLevelNew,
          submissionDate: new Date().toLocaleString()
        };
        alert('Update Success');
        localStorage.setItem('todos', JSON.stringify(this.todos));  
        this.loadTodo();
        this.selectedDateSubmission = new Date().toLocaleString(); 
        
      } else {
        console.error('Todo with ID ' + this.selectedId + ' not found.');
        alert('Error: Unable to find the todo to update.');
    }

    } else {
      alert('Complete all the fields');
      console.log('New title: ' + this.selectedTitle);
      console.log('New description:  ' + this.selectedDescription);
      console.log('New state: ' + this.selectedStateNew);
      
    } 
  }

  limitWords(description: string, limit: number = 10): string {
    if (!description) return '';
    const words = description.split(' '); 
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : description;
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

}
