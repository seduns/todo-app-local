import { Component, HostListener, OnInit } from '@angular/core';
import { SideNavBarComponent } from "../side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../model/todo.mode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

 faClose = faClose;
 faBar = faBars;

onNewStateChange(): void { 
  console.log('State: ', this.selectedStateNew);
}

onNewLevelChange(): void { 
  console.log('Level: ', this.selectedLevelNew);
}

onNewCategoriesChange(): void { 
  console.log('Categories: ', this.selectedCategoriesNew);
}

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
  selectedCategoriesNew: string | null = null;
  selectedDateSubmission: string | null = null;
  selectedUpdateDate: string | null = null;

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
    this.selectedUpdateDate = todo.updateDate;
    this.selectedStateNew = todo.state;
    this.selectedLevelNew = todo.level;
    this.selectedCategoriesNew = todo.categories;
    
    this.showTodo = true;
  }

  saveEdit(): void { 
    if ( this.selectedId !== null && this.selectedTitle  && this.selectedStateNew && this.selectedLevelNew ){
      
      const todoIndex = this.todos.findIndex(todo => todo.todoId === this.selectedId);

      if (todoIndex !== -1) { 
        this.todos[todoIndex] = {
          todoId: this.selectedId,
          title: this.selectedTitle,
          description: this.selectedDescription ?? "null",  
          isComplete: this.todos[todoIndex].isComplete,
          state: this.selectedStateNew,
          level: this.selectedLevelNew,
          categories: this.selectedCategoriesNew ?? "null",
          submissionDate: this.selectedDateSubmission ?? "null",
          updateDate: new Date().toLocaleString()

        };
        alert('Update Success');
        localStorage.setItem('todos', JSON.stringify(this.todos));  
        this.loadTodo();
        this.selectedDateSubmission = new Date().toLocaleString(); 
        this.showTodo = false;
        this.isEditTodo = false;
        
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

  selectedNavIndex: string | null = null;

  toggleNav(event: Event, index: string): void {
      event.stopPropagation(); 
      // Toggle the dropdown only for the clicked card
      this.selectedNavIndex = this.selectedNavIndex === index ? null : index;
      console.log('Selected Index:', this.selectedNavIndex);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.selectedNavIndex = null;
  }

  setComplete(state: string, index: number, event: Event): void {
    event.stopPropagation();

    // Find the correct todo based on state and index
    const todos = this.getTodoByState(state);
    const todo = todos[index];
    
    if (todo) {
        // Toggle completion status and update state
        todo.isComplete = !todo.isComplete;
        todo.state = todo.isComplete ? 'done' : 'new';

        // Update the main todo list and localStorage
        this.todos = this.todos.map(t => t === todo ? { ...todo } : t);
        localStorage.setItem('todos', JSON.stringify(this.todos));
        
        // Reload the todos and close the dropdown
        this.loadTodo();
        this.selectedNavIndex = null;
        console.log('Update', this.todos);
    }
  }
 
  delete(state: string, index: number, event: Event): void {
    event.stopPropagation();

    // Find the todo to delete using the state and index
    const todos = this.getTodoByState(state);
    const todoToDelete = todos[index];

    if (todoToDelete) {
        // Remove the todo from the main list
        this.todos = this.todos.filter(todo => todo !== todoToDelete);
        
        // Update localStorage
        localStorage.setItem('todos', JSON.stringify(this.todos));
        
        // Reload todos and reset selected dropdown
        this.loadTodo();
        this.selectedNavIndex = null;
        console.log('Todo deleted', this.todos);
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
