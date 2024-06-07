import {Component, effect, OnInit, signal} from '@angular/core';
import * as jalaali from 'jalaali-js';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {
  CalendarType,
  gregorianDaysOfWeek,
  gregorianMonthNames,
  jalaliDaysOfWeek,
  jalaliMonthNames
} from "./calendar.model";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  protected readonly CalendarModel = CalendarType;

  // Signals for current year, month, weeks and locale
  protected currentYear = signal(new Date().getFullYear());
  protected currentMonth = signal(new Date().getMonth());
  protected weeks = signal<(number | null)[][]>([]);
  protected calendarLocale = signal(CalendarType.Gregorian);

  // Signals for days of week and month names based on the locale
  protected daysOfWeek = signal(gregorianDaysOfWeek);
  protected monthNames = signal(gregorianMonthNames);
  private selectedDate = signal<Date | null>(null);

  constructor() {
    // Effect to generate the calendar whenever the year or month changes
    effect(() => this.generateCalendar(), {allowSignalWrites: true});
  }

  ngOnInit(): void {
    // Initialize the calendar generation on component initialization
    this.generateCalendar();
  }

  // Method to generate the calendar weeks
  generateCalendar() {
    const weeks: (number | null)[][] = [];
    if (this.isGregorian()) {
      this.generateGregorianCalendar(weeks);
    } else {
      this.generateJalaliCalendar(weeks);
    }
    this.weeks.set(weeks);
  }

  // Helper method to generate Gregorian calendar
  private generateGregorianCalendar(weeks: (number | null)[][]) {
    const date = new Date(this.currentYear(), this.currentMonth(), 1);
    const monthStartDay = date.getDay();
    const lastDateOfMonth = new Date(this.currentYear(), this.currentMonth() + 1, 0).getDate();

    let week: (number | null)[] = new Array(monthStartDay).fill(null);
    for (let day = 1; day <= lastDateOfMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    this.completeWeek(week, weeks);
  }

  // Helper method to generate Jalali calendar
  private generateJalaliCalendar(weeks: (number | null)[][]) {
    const startDate = jalaali.toGregorian(this.currentYear(), this.currentMonth() + 1, 1);
    const startDay = new Date(startDate.gy, startDate.gm - 1, startDate.gd).getDay() + 1;
    const lastDateOfMonth = jalaali.jalaaliMonthLength(this.currentYear(), this.currentMonth() + 1);

    let week: (number | null)[] = new Array(startDay).fill(null);
    for (let day = 1; day <= lastDateOfMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    this.completeWeek(week, weeks);
  }

  // Helper method to complete the week with null values
  private completeWeek(week: (number | null)[], weeks: (number | null)[][]) {
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }
  }

  // Method to check if a date is today
  isToday(date: number | null): boolean {
    if (!date) return false;
    const today = new Date();
    const selectedDate = this.getDate(date);

    return selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();
  }

  private getDate(date: number) {
    return this.isGregorian() ?
      new Date(this.currentYear(), this.currentMonth(), date) :
      this.convertToGregorianDate(date);
  }

// Method to convert Jalali date to Gregorian date
  private convertToGregorianDate(day: number): Date {
    const gregorianDate = jalaali.toGregorian(this.currentYear(), this.currentMonth() + 1, day);
    return new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);
  }

  // Method to switch to the previous month
  previousMonth() {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  // Method to switch to the next month
  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  // Method to toggle between Gregorian and Jalali locales
  toggleLocale(_event: MatSelectChange) {
    if (this.isGregorian()) {
      this.switchToGregorian();
    } else {
      this.switchToJalali();
    }
  }

  // Helper method to switch to Gregorian locale
  private switchToGregorian() {
    this.daysOfWeek.set(gregorianDaysOfWeek);
    this.monthNames.set(gregorianMonthNames);
    const gregorianDate = this.convertToGregorianDate(29)
    this.currentYear.set(gregorianDate.getFullYear());
    this.currentMonth.set(gregorianDate.getMonth());
  }

  // Helper method to switch to Jalali locale
  private switchToJalali() {
    this.daysOfWeek.set(jalaliDaysOfWeek);
    this.monthNames.set(jalaliMonthNames);
    const currentGregorianDate = new Date(this.currentYear(), this.currentMonth(), 1);
    const jalaaliDate = jalaali.toJalaali(currentGregorianDate.getFullYear(), currentGregorianDate.getMonth() + 1, 1);
    this.currentYear.set(jalaaliDate.jy);
    this.currentMonth.set(jalaaliDate.jm - 1);
  }

  // Method to check if the current locale is Gregorian
  private isGregorian(): boolean {
    return this.calendarLocale() === CalendarType.Gregorian;
  }

  selectDate(date: number | null) {
    if (!date) return
    if (this.isSelected(date)) {
      this.selectedDate.set(null)
      return;
    }
    this.selectedDate.set(this.getDate(date));
  }

  isSelected(date: number | null): boolean {
    if (!date) return false
    return this.selectedDate()?.getTime() === this.getDate(date).getTime();
  }
}
