import { CommonModule } from '@angular/common';
import { CheckboxControlValueAccessor, FormsModule } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { Todo } from '../model/todo.mode';
import { faBars, faCheck, faClose, faL, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { eventNames } from 'node:process';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule ],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit {

  faPlus = faPlus;
  faClose = faClose;
  faTrash = faTrash;
  faBar = faBars;
  faCheck = faCheck;

  constructor() {}

  todoId: number = 0;
  title: string = '';
  description: string = '';
  selectState: string = 'new';
  selectLevel: string = 'medium';
  selectCategories: string = 'other';
  isComplete: boolean = false;
  submissionDate: string | null = null;
  storeLatestTodo: number = 0 ; 

  todos:Todo[] =[] ;
  allTodos: Todo[] =[];

  ngOnInit(): void {
    this.checkLocalStorageUsage();
    this.loadTodo();
    this.getLatestTodoId();

    this.todos.forEach(todo => { 
      if (todo.state === "done") {
        todo.isComplete = true;
      } else { 
        todo.isComplete = false;
      }
    })
  }

  usage: string | null = null;

  checkLocalStorageUsage(): void {
    if (typeof window != 'undefined') { 

    try {
      // Calculate the approximate size of localStorage usage in bytes
      const usedBytes = new TextEncoder().encode(JSON.stringify(localStorage)).length;
      const maxBytes = 5 * 1024 * 1024; // Approx. 5MB limit

      this.usage = usedBytes.toString();

      console.log(`localStorage usage: ${usedBytes} bytes`);
      
      if (usedBytes >= maxBytes) { 
        console.log('localStorage is full');
      } else if (usedBytes >= maxBytes * 0.9) { 
          console.log('localStorage is almost full!');
      }


    } catch (e) {
      console.error('Error checking localStorage usage:', e);
    }
  }
  }

  // Clear all localStorage data
  clearLocalStorage(): void {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      localStorage.clear();
      this.todos = []; // Clear the local todos array as well
      console.log('All localStorage data cleared.');
      this.loadTodo();
      this.checkLocalStorageUsage();
    }
  }

  loadTodo(): void { 
    if (typeof window != 'undefined') { 
      const storedTodo = localStorage.getItem('todos');
      if (storedTodo) {
        this.todos = JSON.parse(storedTodo);
        this.allTodos = [...this.todos];
  
        console.log("Stored Todos:", this.todos);
        this.todos.forEach(todo => {
            // console.log("Stored Date:", todo.submissionDate);
        });
      }
    }
  }

  onDateChange(): void {
    console.log('Selected Date: ', this.selectedDate);
    this.filteredTodos();
  }

  onStateChange(): void { 
    // this.selectState = this.selectState;
    console.log('State: ', this.selectState);
  } 
  
  onNewStateChange(): void { 
    console.log('State: ', this.selectedStateNew);
  }

  onLevelChange(): void { 
    console.log('Level: ', this.selectLevel);
  }
  
  onNewLevelChange(): void { 
    console.log('Level: ', this.selectedLevelNew);
  }
  
  onCategoriesChange(): void { 
    console.log('Categories: ', this.selectCategories);
  }

  onNewCategoriesChange(): void { 
    console.log('Categories: ', this.selectedCategoriesNew);
  }

  filteredTodos(): void {
    // Start with all todos as the base
    this.todos = [...this.allTodos];

    if (this.selectedLevelOption) { 
      const selectLevel = this.selectedLevelOption;
      this.todos = this.allTodos.filter((todo) => {
        return todo.level === selectLevel;
      }) 
    }

    // Apply date filter if a date is selected
    if (this.selectedDate) {
        const selectedDateString = new Date(this.selectedDate).toLocaleDateString();
        this.todos = this.todos.filter((todo) => {
            const todoDateString = new Date(todo.submissionDate).toLocaleDateString();
            console.log(`Comparing dates: ${todoDateString} === ${selectedDateString}`);
            return todoDateString === selectedDateString;
        });
    }

    console.log('Filtered Todos:', this.todos);
}

selectedNavIndex: number | null = null;

toggleNav(event: Event, index: number): void {
  event.stopPropagation(); 

  // Toggle the selected index or close if the same index is clicked
  this.selectedNavIndex = this.selectedNavIndex === index ? null : index;
  console.log(this.selectedNavIndex); 


}

@HostListener('document:click', ['$event'])
onDocumentClick(event: Event): void {
  this.selectedNavIndex = null;
}



  getLatestTodoId(): number { 
    if (this.allTodos.length === 0) { 
        console.log('No item');
        this.storeLatestTodo = 0; // Initialize to 0 if no items exist
        return 0;
    }

    const latestTodoId = Math.max(...this.allTodos.map(todo => todo.todoId));
    this.storeLatestTodo = latestTodoId;

    console.log('Latest Todo ID: ' + this.storeLatestTodo);
    return latestTodoId;
  }

  
  submit(): void {
    if (this.title && this.selectState && this.selectCategories) {

      this.todoId = this.getLatestTodoId() + 1;

      this.todos.push({ todoId: this.todoId, title: this.title, description: this.description, isComplete: this.isComplete, submissionDate: new Date().toLocaleString(), state:  this.selectState, level: this.selectLevel, categories: this.selectCategories, updateDate: "null"});  // Add the todo as an object.

      if (typeof window !== 'undefined') {  // Ensure localStorage available.
        localStorage.setItem('todos', JSON.stringify(this.todos));  // submit new to localStorage.
      }

      console.log('New task added: ', this.title);
      alert('New task added');
      this.loadTodo();
      this.checkLocalStorageUsage();
      this.title = '';  // Clear the input field after submission.
      this.description = '';  // Clear the description field.
      this.selectState = 'new';
      this.isAddTask = false;
      this.getLatestTodoId();
    } 
    else {
      alert('Complete all the form!');
    }
  }

  setComplete(index: number, event: Event): void {
    event.stopPropagation();  // Prevent event from bubbling up to the li element
  
    // Directly toggle the isComplete property for the clicked todo
    this.todos[index].isComplete = !this.todos[index].isComplete;

    this.todos[index].state = this.todos[index].isComplete ? "done" : "new";

     // Save the updated todos to localStorage
    localStorage.setItem('todos', JSON.stringify(this.todos));
    
    this.loadTodo();
    this.checkLocalStorageUsage();
    console.log('Update', this.todos);
    
    this.selectedNavIndex = null;
  }
  
 
  
  delete(index: number, event: Event): void {
    event.stopPropagation();
    this.todos.splice(index, 1);  // Remove the todo item at the specified index.
    if (typeof window !== 'undefined') {  // Ensure localStorage is available.
      localStorage.setItem('todos', JSON.stringify(this.todos));  // Update localStorage.
    }
    console.log('Todo deleted');
    this.checkLocalStorageUsage();

    this.selectedNavIndex = null;

  }

  showTodo: boolean = false;
  selectedIndex: number | null = null;
  selectedId: number | null = null;
  selectedTitle: string | null = null;
  selectedDescription: string | null = null;
  selectedStateNew: string | null = null;
  selectedLevelNew: string | null = null;
  selectedCategoriesNew: string | null = null;
  selectedDateSubmission: string | null = null;
  selectedUpdateDate: string | null = null;
  selectedDate: string | null = null;

  selectedLevelOption: string | null = null;


  onSelectedStateChange(): void { 
    console.log('Selected Filtered State: ' + this.selectedLevelOption);
    this.filteredTodos();
  }


  openTodos(todo: Todo, index: number): void  {
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
    if ( this.selectedIndex !== null && this.selectedTitle && this.selectedStateNew && this.selectedLevelNew && this.selectedCategoriesNew && this.selectedUpdateDate){
      this.todos[this.selectedIndex] = {
        todoId: this.selectedId ?? 0,
        title: this.selectedTitle,
        description: this.selectedDescription ?? "null",
        isComplete: this.selectedStateNew === "done" ? true : false,
        state: this.selectedStateNew,
        level: this.selectedLevelNew,
        categories: this.selectedCategoriesNew ?? "null",
        submissionDate: this.selectedDateSubmission ?? "null",
        updateDate: new Date().toLocaleString()
      };
      alert('Update Success');
      localStorage.setItem('todos', JSON.stringify(this.todos));
      this.loadTodo();
      this.checkLocalStorageUsage();
      this.selectedDateSubmission = new Date().toLocaleString(); 
      this.showTodo = false;
      this.isEditTodo = false;


    } else {
      alert('Complete all the fields');
      //check value retrieve
      console.log('todoId : ' + this.selectedId);
      console.log('New title: ' + this.selectedTitle);
      console.log('Complete: ' + this.isComplete);
      console.log('New description:  ' + this.selectedDescription);
      console.log('New state: ' + this.selectedStateNew);
      console.log('New level: ' + this.selectedLevelNew);
      
    }
  }

  isAddNewCate: boolean = false;

  addNewCategory(): void {
    this.isAddNewCate = !this.isAddNewCate;
    console.log(this.isAddNewCate);
  }

  limitWords(title: string, limit: number = 5): string {
    if (!title) return '';
    const words = title.split(' '); 
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : title;
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
