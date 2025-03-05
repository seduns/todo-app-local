import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, inject, Inject, OnInit, PLATFORM_ID, runInInjectionContext, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Todo } from '../model/todo.mode';
import { stringify } from 'node:querystring';
import { consumerAfterComputation } from '@angular/core/primitives/signals';
import { Chart, registerables } from 'chart.js';
import { faBars, faBlackboard, faCheck, faClose, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { create } from 'node:domain';
import { createTracing } from 'node:trace_events';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

Chart.register(...registerables);

@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  faPlus = faPlus;
  faClose = faClose;
  faTrash = faTrash;
  faBar = faBars;
  faCheck = faCheck;


  todos:Todo[] =[] ;
  allTodos: Todo[] =[];

  constructor(private router : Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
      this.loadTodo();
      this.checkLocalStorageUsage();
      this.totalCategoriesSubmit();

      //check running on browser
      if (isPlatformBrowser(this.platformId)) { 
        setTimeout(() =>  {
          this.createChart();
        }, 100);
    }
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
    setTimeout(() => { 

      this.categoryCounts = {};
      
      this.todos.forEach((todo) => { 
        const category = todo.categories;
        if (category) { 
              this.categoryCounts[category] = (this.categoryCounts[category] || 0) + 1;
            }
      });

      console.log('Total submit by categories:', this.categoryCounts);
    }, 0);

    this.createChart();
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
    if (this.chart) { 
      this.chart.destroy();
    }

   if (this.chartCanvas?.nativeElement) {

    const labels = Object.keys(this.categoryCounts);
    const values = Object.values(this.categoryCounts);

    const totalTask = values.reduce((sum, value) => sum + value, 0);

    const percentage = values.map(value => ((value/ totalTask)) * 100);

      this.chart = new Chart(this.chartCanvas.nativeElement, { 
        type: 'pie', 
        data: { 
          labels: labels,
          datasets: [ 
            { 
              label: 'Task by Category',
              data: values,
              backgroundColor: [ 
                '#007ec2', '#00b02f', '#0205b8'
              ],
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.23)',
              
            }
          ], 
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: { 
            tooltip : { 
              callbacks: { 
                label: function (tooltipItem: any) { 
                  let dataset = tooltipItem.dataset;
                  let currentValue = dataset.data[tooltipItem.dataIndex];
                  let percentage = ((currentValue / totalTask) * 100).toFixed(2);
                  return `${labels[tooltipItem.dataIndex]}: ${percentage}%`;
                }
              }
            }
          }
        },

      })
   }
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

  limitWords(description: string, limit: number = 10): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : description;
  }
}
