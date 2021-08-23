import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  previousUrl: string;
  public isNewUser: boolean;
  public isDevMode: boolean;

  constructor() {
  }

  isIE10orLower() {
    if (window.document["documentMode"]) {
      return true;
    }

    return false;
  }
}