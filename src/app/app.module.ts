import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; //
import { MaterialModule} from './app.material.module'; //customized MaterialModule
import { CronEventService } from './data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MaterialModule,
    HttpModule,
    HttpClientModule,
  ],
  providers: [CronEventService],
  bootstrap: [AppComponent]
})
export class AppModule {}
