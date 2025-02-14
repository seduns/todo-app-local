import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BlobOptions } from 'buffer';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit {

  title: string = '';
  description: string = '';
  isComplete: boolean = false;

  todos: { title: string, description: string, isComplete: boolean}[] = [];


  ngOnInit(): void {
    if (typeof window !== 'undefined') {  // Check if it's running in the browser.
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    }
  }

  submit(): void {
    if (this.title && this.description ) {
      this.todos.push({ title: this.title, description: this.description, isComplete: this.isComplete });  // Add the todo as an object.
      if (typeof window !== 'undefined') {  // Ensure localStorage is available.
        localStorage.setItem('todos', JSON.stringify(this.todos));  // Save the updated list to localStorage.
      }
      console.log('New todo added: ', this.title);
      alert('New todo added');
      this.title = '';  // Clear the input field after submission.
      this.description = '';  // Clear the description field.
    } 
    else {
      alert('Complete all the form!');
    }
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

  openTodos(todo: any, index: number): void { 
    this.showTodo = true;

    this.selectedIndex = index;
    this.selectedTitle = todo.title;
    this.selectedDescription = todo.description;

    // alert('Todo open: ' + todo.title + " " + todo.description);
  }

  saveEdit(): void { 
    if ( this.selectedIndex !== null && this.selectedTitle && this.selectedDescription  ){
      
      this.todos[this.selectedIndex] = {
        title: this.selectedTitle,
        description: this.selectedDescription,
        isComplete: false
      };
      alert('Update Success');
      localStorage.setItem('todos', JSON.stringify(this.todos));

    } else {
      alert('Complete all the fields');
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
}
