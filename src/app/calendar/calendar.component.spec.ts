import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarComponent} from './calendar.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {CalendarType, gregorianDaysOfWeek, jalaliDaysOfWeek} from './calendar.model';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        CalendarComponent,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the calendar on initialization', () => {
    expect(component["weeks"]().length).toBeGreaterThan(0);
  });

  it('should navigate to the previous month', () => {
    const initialMonth = component["currentMonth"]();
    component.previousMonth();
    fixture.detectChanges();

    if (initialMonth === 0) {
      expect(component["currentMonth"]()).toBe(11);
      expect(component["currentYear"]()).toBeLessThan(component["currentYear"]() + 1);
    } else {
      expect(component["currentMonth"]()).toBeLessThan(initialMonth);
    }
  });

  it('should navigate to the next month', () => {
    const initialMonth = component["currentMonth"]();
    component.nextMonth();
    fixture.detectChanges();

    if (initialMonth === 11) {
      expect(component["currentMonth"]()).toBe(0);
      expect(component["currentYear"]()).toBeGreaterThan(component["currentYear"]() - 1);
    } else {
      expect(component["currentMonth"]()).toBeGreaterThan(initialMonth);
    }
  });

  it('should toggle between Gregorian and Jalali locales', () => {
    component["calendarLocale"].set(CalendarType.Jalali)
    component.toggleLocale({} as any);
    fixture.detectChanges();
    expect(component["calendarLocale"]()).toBe(CalendarType.Jalali);
    expect(component["daysOfWeek"]()).toEqual(jalaliDaysOfWeek);

    component["calendarLocale"].set(CalendarType.Gregorian)
    component.toggleLocale({} as any);
    fixture.detectChanges();
    expect(component["calendarLocale"]()).toBe(CalendarType.Gregorian);
    expect(component["daysOfWeek"]()).toEqual(gregorianDaysOfWeek);
  });

  it('should select and deselect a date', () => {
    const date = 15;
    component.selectDate(date);
    fixture.detectChanges();
    expect(component.isSelected(date)).toBeTrue();

    component.selectDate(date);
    fixture.detectChanges();
    expect(component.isSelected(date)).toBeFalse();
  });

  it('should identify today\'s date', () => {
    const today = new Date().getDate();
    expect(component.isToday(today)).toBeTrue();
  });
});
