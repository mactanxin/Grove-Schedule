import { Injectable } from '@angular/core';
import { CronEvent } from './cron-event';
import { Http, Response } from '@angular/http';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CronEventService {

  private url = 'https://scheduler-challenge.herokuapp.com/schedule'

  constructor(private http : Http) { }

  getEvents(): Observable<CronEvent[]> {
  	return this.http.get(this.url)
  		.map((res:Response) => res.json())
  		.catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }
}