import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Todo } from '../model/todo.mode';
import { stringify } from 'node:querystring';
import { consumerAfterComputation } from '@angular/core/primitives/signals';
import { Chart, registerables } from 'chart.js';
import { create } from 'node:domain';

Chart.register(...registerables);

@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;


  todos:Todo[] =[] ;
  allTodos: Todo[] =[];
  constructor(private router : Router) {}

  ngOnInit(): void {
        this.loadTodo();
        this.checkLocalStorageUsage();
        this.totalCategoriesSubmit();
  } 

  checkLocalStorageUsage(): void {
    if (typeof window != 'undefined') { 
    try {
      // Calculate the approximate size of localStorage usage in bytes
      const usedBytes = new TextEncoder().encode(JSON.stringify(localStorage)).length;
      const maxBytes = 5 * 1024 * 1024; // Approx. 5MB limit

      console.log(`localStorage usage: ${usedBytes} bytes`);
      
      if (usedBytes >= maxBytes * 0.9) { // Warn at 90% capacity
        console.warn('localStorage is almost full!');
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
    }
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

  createChart(): void {
    if (this.chartCanvas?.nativeElement) {
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: 'Sample Data',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('Chart canvas not available');
    }
  }




  limitWords(description: string, limit: number = 10): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : description;
  }
}
