import { Component, OnInit } from '@angular/core';
import { MatCardModule, MatGridListModule, MatListModule } from '@angular/material';
import { CronEvent } from './cron-event';
import { CronEventService } from './data.service';
import * as parser from 'cron-parser';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Grove-Scheduler';
  notes = [{
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  dataList = [];
  next_24_hour_events = [];
  sortedList = [];
  all_events = [];
  on_going_event = [];
  prve_3_hour_events = [];

  constructor(private eventService: CronEventService) {}

  ngOnInit() {
    this.getCronEvents();
    this.sortSchedules();
    IntervalObservable.create(1000).subscribe(()=>{
      this.checkSchedules();
    });
  }

  getOnGoingEvent() {
    let now: any = new Date();
    this.sortedList.filter((schedule) => {
      if (schedule.next.toDate() - now < 5 * 60000) {
        this.on_going_event.push(schedule);
      }
    });
  }

  sortedSchedulesNext24Hours() {
    let now: any = new Date();
    this.sortedList.filter((schedule) => {
      if (schedule.next.toDate() - now < 24 * 60 * 60000) {
        this.next_24_hour_events.push(schedule);
      }
    });
  }

  previousSchedules(){
    let now: any = new Date();
    this.sortedList.filter((schedule) => {
      if (now - schedule.prev().toDate() < 3* 60 * 60000) {
        this.prve_3_hour_events.push(schedule);
      }
    })
  }

  sortPrevSchedules(){
    if (!this.prve_3_hour_events) {
      return [];
    } else {
      let cloned_list = this.prve_3_hour_events.map(x => Object.assign({}, x));
      cloned_list.sort((a, b) => {
        if (a.prev.toDate() > b.prev.toDate()) {
          return -1;
        } else if (a.prev.toDate() < b.prev.toDate()) {
          return 1;
        } else {
          return 0;
        }
      });
      this.sortedList = cloned_list;
    }
  }

  sortSchedules() {
    if (!this.dataList) {
      return [];
    } else {
      let cloned_list = this.dataList.map(x => Object.assign({}, x));
      cloned_list.sort((a, b) => {
        if (a.next.toDate() < b.next.toDate()) {
          return -1;
        } else if (a.next.toDate() > b.next.toDate()) {
          return 1;
        } else {
          return 0;
        }
      });
      this.sortedList = cloned_list;
    }
  }

  getCronEvents() {
    this.eventService.getEvents().subscribe((res) => {
      if (res) {
        try {
          console.log(res);
          this.dataList = res['data'].map((schedule) => {
            return {
              id: schedule.id,
              type: schedule.type,
              name: schedule.attributes.name,
              cron: schedule.attributes.cron,
              next: null,
              lastNotified: null,
              countdown: null
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
      this.checkSchedules();
      this.previousSchedules();
      this.sortSchedules();
      this.getOnGoingEvent();
      this.sortedSchedulesNext24Hours();
    }, (err) => {
      console.log(err);
    })
  }

  checkSchedules() {
    // this checks all schedules in background
    // if a schedule is about to start, notify user
    if (!this.dataList) {
      return;
    }
    let now: any = new Date();
    this.dataList
      .forEach(schedule => {
        schedule.next = parser.parseExpression(schedule.cron).next();
        schedule.prev = parser.parseExpression(schedule.cron).prev();
        let scheduleDate = schedule.next.toDate();
        if (scheduleDate - now < 1000 && (!schedule.lastNotified || schedule.lastNotified < scheduleDate)) {
          this.notify(schedule);
        }
      });
  }

  // update its lastest notified time
  // get windows notification permission
  // send notification
  notify(schedule) {
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
    } else {
      Notification.requestPermission(function(permission) {
        var notification = new Notification("A new event starts", { body: schedule.name });
        setTimeout(function() {
          notification.close();
        }, 3000);
      });
    }
  }
}
