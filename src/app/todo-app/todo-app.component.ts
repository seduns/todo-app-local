import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { Todo } from '../model/todo.mode';
import { faBars, faCheck, faClose, faL, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { eventNames } from 'node:process';
import { filter } from 'rxjs';

@Component({
    selector: 'app-todo-app',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule],
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
    this.loadTodo(); // Load all todos first
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
    if (typeof window !== 'undefined') { 
        const storedTodo = localStorage.getItem('todos');
        if (storedTodo) {
            this.allTodos = JSON.parse(storedTodo);

            // Ensure `isComplete` is correctly set
            this.allTodos.forEach(todo => { 
                todo.isComplete = todo.state === "done";
            });

            this.filteredTodos(); // Apply filters automatically

            console.log("Stored Todos:", this.allTodos);
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

  selectedLevelOption: string | null = null;
  selectedStateOption: string | null = null;
  searchItem: string | null = null;

  filteredTodos(): void {
    // Start with all todos as the base
    this.todos = [...this.allTodos];

    // Apply search filter (case-insensitive, partial match)
    if (this.searchItem) { 
        this.todos = this.todos.filter(todo => 
        (todo.title?.toLowerCase().includes(this.searchItem ?? "") || todo.description?.toLowerCase().includes(this.searchItem ?? ""))
        );
    }

    // Apply level filter
    if (this.selectedLevelOption) { 
        this.todos = this.todos.filter(todo => todo.level === this.selectedLevelOption);
    }

    if (this.selectedStateOption) { 
        this.todos = this.todos.filter(todo => todo.state === this.selectedStateOption);
    }

    // Apply date filter safely
    if (this.selectedDate) {
        const selectedDateObj = new Date(this.selectedDate);
        if (!isNaN(selectedDateObj.getTime())) { // Ensure valid date
            const selectedDateString = selectedDateObj.toISOString().split('T')[0];

            this.todos = this.todos.filter(todo => {
                const todoDateObj = todo.submissionDate ? new Date(todo.submissionDate) : null;
                const todoDateString = todoDateObj && !isNaN(todoDateObj.getTime()) 
                    ? todoDateObj.toISOString().split('T')[0] 
                    : null;

                return todoDateString === selectedDateString;
            });
        }
    }

    // console.log('Filtered Todos:', this.todos);
  }


  selectedNavId: number | null = null;

  toggleNav(event: Event, todoId: number): void {
    event.stopPropagation(); 

    // Toggle based on todoId instead of index
    this.selectedNavId = this.selectedNavId === todoId ? null : todoId;
    console.log('Selected Nav ID:', this.selectedNavId);
}


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.selectedNavId = null;
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

        const newTodo = {
            todoId: this.todoId,
            title: this.title,
            description: this.description || "",
            isComplete: this.isComplete || false,
            submissionDate: new Date().toLocaleString(),
            state: this.selectState,
            level: this.selectLevel || "low",
            categories: this.selectCategories,
            updateDate: "" // Use empty string instead of "null"
        };

        // Add the new todo to allTodos (ensuring filtering works)
        this.allTodos.push(newTodo);
        this.todos.push(newTodo); // Also update displayed list

        if (typeof window !== 'undefined') {
            localStorage.setItem('todos', JSON.stringify(this.allTodos));
        }

        console.log('New task added:', newTodo);
        alert('New task added');

        this.loadTodo();  // Reload todos & apply filters
        this.checkLocalStorageUsage();

        // Clear input fields after adding a new task
        this.title = '';
        this.description = '';
        this.selectState = 'new';
        this.isAddTask = false;
    } else {
        alert('Complete all the form fields!');
    }
}


  setComplete(todoId: number, event: Event): void {
    event.stopPropagation();  

    // Find the todo in allTodos to ensure filtering works correctly
    const todo = this.allTodos.find(t => t.todoId === todoId);
    if (!todo) return; // Exit if not found

    // Toggle completion status
    todo.isComplete = !todo.isComplete;
    todo.state = todo.isComplete ? "done" : "new";

    // Save updates to localStorage
    localStorage.setItem('todos', JSON.stringify(this.allTodos));

    // Apply filtering after update
    this.filteredTodos();
    this.checkLocalStorageUsage();
    console.log('Updated Todos:', this.todos);

    this.selectedNavId = null;
  }
  
  delete(todoId: number, event: Event): void {
    event.stopPropagation();

    // Find index in allTodos
    const index = this.allTodos.findIndex(todo => todo.todoId === todoId);
    if (index === -1) return; // Exit if not found

    // Remove the todo from allTodos
    this.allTodos.splice(index, 1);

    // Update localStorage with the new list
    localStorage.setItem('todos', JSON.stringify(this.allTodos));

    console.log('Todo deleted:', todoId);

    // Reload full todo list and apply filters again
    this.loadTodo();

    // Update localStorage usage info
    this.checkLocalStorageUsage();

    this.selectedNavId = null;
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

  


  onSelectedLevelChange(): void { 
    console.log('Selected Filtered State: ' + this.selectedLevelOption);
    this.filteredTodos();
  }

  onSelectedStateChange(): void { 
    console.log('Selected Filtered State: ' + this.selectedStateOption);
    this.filteredTodos();
  }


  openTodos(todo: Todo): void {
    if (event && event.target instanceof HTMLInputElement) {
        return;  // Do nothing if a radio button was clicked
    } 

    console.log('Selected todo id: ' + todo.todoId);
    this.selectedId = todo.todoId;
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
    if (this.selectedId !== null && this.selectedTitle && this.selectedStateNew && this.selectedLevelNew && this.selectedCategoriesNew) {
        // Find the todo in `allTodos` (not just `todos`)
        const todo = this.allTodos.find(t => t.todoId === this.selectedId);
        if (!todo) {
            alert('Todo not found!');
            return;
        }

        // Update todo properties
        todo.title = this.selectedTitle;
        todo.description = this.selectedDescription ?? "null";
        todo.isComplete = this.selectedStateNew === "done";
        todo.state = this.selectedStateNew;
        todo.level = this.selectedLevelNew;
        todo.categories = this.selectedCategoriesNew ?? "null";
        todo.submissionDate = this.selectedDateSubmission ?? "null";
        todo.updateDate = new Date().toLocaleString();

        alert('Update Success');
        
        // Save updated todos to localStorage
        localStorage.setItem('todos', JSON.stringify(this.allTodos));

        // Reload all todos, then apply filters again
        this.loadTodo();
        
        this.checkLocalStorageUsage();

        // Reset UI state
        this.showTodo = false;
        this.isEditTodo = false;

    } else {
        alert('Complete all the fields');
        console.log('todoId : ' + this.selectedId);
        console.log('New title: ' + this.selectedTitle);
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

  resetAllFilter(): void { 
    this.selectedLevelOption = null; 
    this.selectedStateOption = null; 
    this.selectedDate = null; 
    this.todos = [...this.allTodos];
  }   


}
