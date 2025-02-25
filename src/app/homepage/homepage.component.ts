import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Todo } from '../model/todo.mode';
import { stringify } from 'node:querystring';
import { consumerAfterComputation } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {

  todos:Todo[] =[] ;
  allTodos: Todo[] =[];
  constructor(private router : Router) {}

    ngOnInit(): void {
        this.loadTodo();
        this.totalCategoriesSubmit();
  } 

  showTodo: boolean = false;
  selectedIndex: number | null = null;
  selectedTitle: string | null = null;
  selectedDescription: string | null = null;
  selectedDateSubmission: string | null = null;
  selectedDate: string | null = null;

  totalTask : number = 0;
  totalCategorisSubmit : number = 0;

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

  getTodoByCategories(categories: string) {
    return this.todos.filter(todo => todo.categories === categories);
  }

  categoryCounts: { [key: string]: number } = {};

  totalCategoriesSubmit(): void {
      this.categoryCounts = {};

      this.todos.forEach((todo) => { 
          const category = todo.categories;
          if (category) { 
              this.categoryCounts[category] = (this.categoryCounts[category] || 0) + 1;
          }
      });

      console.log('Total submit by categories:', this.categoryCounts);
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

    this.router.navigate(['todo']);
    
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
