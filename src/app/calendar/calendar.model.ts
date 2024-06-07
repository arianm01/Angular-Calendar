export enum CalendarType {
  Jalali = 'Jalali',
  Gregorian = 'Gregorian'
}

// Weekday names for Gregorian and Jalali calendars
export const gregorianDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const jalaliDaysOfWeek = ['Shan', 'Yek', 'Do', 'Se', 'Chah', 'Panj', 'Jom'];

// Month names for Gregorian and Jalali calendars
export const gregorianMonthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export const jalaliMonthNames = [
  'Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad',
  'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'
];
