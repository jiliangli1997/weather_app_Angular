import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private tommessage = new BehaviorSubject<any>("*");
  tomcurrentMessage = this.tommessage.asObservable();

  private addmessage = new BehaviorSubject<any>("*");
  addcurrentMessage = this.addmessage.asObservable();

  private llmessage = new BehaviorSubject<any>("*");
  llcurrentMessage = this.llmessage.asObservable();

  private fav = new BehaviorSubject<any>("");
  curFav = this.fav.asObservable();

  constructor(private http: HttpClient) { }

  changetomMessage(message: any) {
    this.tommessage.next(message);
  }

  changeaddMessage(message: any) {
    this.addmessage.next(message);
  }

  changeFav(message: any) {
    this.fav.next(message);
  }
}
