import {Component} from '@angular/core';
import {CalendarComponent} from './calendar/calendar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    CalendarComponent,
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>Angular Calendar</span>
      </mat-toolbar>
      <main>
        <app-calendar></app-calendar>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
}
