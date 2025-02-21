import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavStateServiceService {
  private _isMinimizeNav = false;

  set isMinimizeNav(value: boolean) {
    this._isMinimizeNav = value;
  }

  get isMinimizeNav(): boolean {
    return this._isMinimizeNav;
  }
}
