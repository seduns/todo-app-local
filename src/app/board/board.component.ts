import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SideNavBarComponent } from "../side-nav-bar/side-nav-bar.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../model/todo.mode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faClose, faSlash } from '@fortawesome/free-solid-svg-icons';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { windowTime } from 'rxjs';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule, DragDropModule ],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

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

@ViewChild('scrollContainer') scrollContainer!: ElementRef

private scrollListener!: () => void;

  ngOnInit(): void {
    this.loadTodo();
  }

  ngAfterViewInit(): void {
    const scrollContainer = this.document.querySelector('tbody');

    if (scrollContainer) { 
      // ✅ Add event listener to close dropdown on scroll inside tbody
      this.scrollListener = this.renderer.listen(scrollContainer, 'scroll', () => {
        console.log('Scroll detected inside tbody, closing dropdown');
        this.selectedNavIndex = null;
      });
    } 
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

  
  ngOnDestroy() {
    // ✅ Remove listener when component is destroyed (performance optimization)
    if (this.scrollListener) {
      this.scrollListener();
    }
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

    allowDrop(event: DragEvent) { 
      event.preventDefault();
    }

    draggedTodo: any = null;

    drag(event: DragEvent, todo: any) { 
      this.draggedTodo = todo; 
      event.dataTransfer?.setData("text/plain", JSON.stringify(todo));

      this.renderer.setStyle(event.target, 'opacity', '0.5');
      this.renderer.setStyle(event.target, 'border', '2px dashed #62ea74');
    }

    drop(event: DragEvent, newState: string) {
      event.preventDefault();
    
      const todoData = event.dataTransfer?.getData("text");
      if (!todoData) return;
    
      const todo = JSON.parse(todoData);
    
      // Remove the old todo from the array
      this.allTodos = this.allTodos.filter(t => t.todoId !== todo.todoId);
    
      // Update the todo's state
      todo.state = newState;
    
      // Get the target element
      const targetElement = event.target as HTMLElement;
      const targetRect = targetElement.getBoundingClientRect();
      const dropPosition = event.clientY - targetRect.top; // Y position inside the column
    
      // Determine if the drop happened near the top or bottom  
      const insertAtTop = dropPosition < targetRect.height / 2;
    
      if (insertAtTop) {
        this.allTodos.unshift(todo); // Insert at the top
      } else {
        this.allTodos.push(todo); // Insert at the bottom
      }
    
      // Save and refresh UI
      localStorage.setItem('todos', JSON.stringify(this.allTodos));
      this.loadTodo();
    }
    
    
    

    dragEnd(event: DragEvent) { 
      console.log("Drag ended:", this.draggedTodo);
      this.resetDragStyle(event);
    }
    

    resetDragStyle(event: DragEvent) { 
      const target = event.target as HTMLElement;
      if (target) {
        this.renderer.setStyle(target, 'opacity', '1`');
        this.renderer.setStyle(target, 'border', 'none');
      }
    }
    

    updateTodoStore(updatedTodo: any) { 
      const index = this.allTodos.findIndex(todo => todo.todoId === updatedTodo.todoId);
      if (index !== -1) {
        this.allTodos[index] = updatedTodo;
        localStorage.setItem('todos', JSON.stringify(this.allTodos));
        this.loadTodo(); 
      }
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
