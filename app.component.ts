import { Component, OnInit } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  readonly url = 'https://weatherhw8-331017.wl.r.appspot.com/?lat=-73.98529171943665&lon=4.75872069597532&auto=false';
  readonly localurl = 'http://localhost:4600/?lat=-73.98529171943665&lon=40.75872069597532'
  post: any;

  constructor(private http: HttpClient) {

  }
}
