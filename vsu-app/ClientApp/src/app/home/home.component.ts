import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLocalHost: boolean = false;
  isIE: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    var ua = window.navigator.userAgent;
    this.isIE = /MSIE|Trident/.test(ua);

    if (window.location.origin === "http://localhost:5000" || window.location.origin === "https://localhost:5001") {
      this.isLocalHost = true;
    }
    else {
      this.router.navigate(['notification_applicaiton']);
    }
  }
}
