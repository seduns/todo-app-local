import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavStateService{


  private isNavHiddenSubject = new BehaviorSubject<boolean>(false);
  isNavHidden$ = this.isNavHiddenSubject.asObservable(); // Observable for components

  private readonly NAV_STATE_KEY_HIDE = 'isNavHide';

  constructor() { 

    if (typeof window !== 'undefined') { 

      const hideState = localStorage.getItem(this.NAV_STATE_KEY_HIDE);
      this.isNavHiddenSubject.next(hideState === 'true');
    }
  }

  toggleNav() {
    const newState = !this.isNavHiddenSubject.value;
    this.isNavHiddenSubject.next(newState); // ✅ Notify all components
    localStorage.setItem(this.NAV_STATE_KEY_HIDE, String(newState));
    console.log('Nav Hidden State:', newState);
  }
}
