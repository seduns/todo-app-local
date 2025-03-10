import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavStateService {
  private isNavHiddenSubject = new BehaviorSubject<boolean>(false);
  isNavHidden$ = this.isNavHiddenSubject.asObservable(); // Observable for components

  toggleNav() {
    const newState = !this.isNavHiddenSubject.value;
    this.isNavHiddenSubject.next(newState); // ✅ Notify all components
    console.log('Nav Hidden State:', newState);
  }
}
