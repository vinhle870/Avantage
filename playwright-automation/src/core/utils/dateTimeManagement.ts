/**
 * DateTime Management Utilities
 * Date and time manipulation functions
 */

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export class DateTimeManager {
  /**
   * Get current date and time as ISO string
   */
  public static getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  /**
   * Get current date as YYYY-MM-DD
   */
  public static getCurrentDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  /**
   * Get current time as HH:MM:SS
   */
  public static getCurrentTime(): string {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
  }

  /**
   * Add days to date
   */
  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add months to date
   */
  public static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Add years to date
   */
  public static addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * Add hours to date
   */
  public static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  /**
   * Add minutes to date
   */
  public static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  /**
   * Subtract days from date
   */
  public static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  /**
   * Get difference between two dates in days
   */
  public static getDaysDifference(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Get difference between two dates in hours
   */
  public static getHoursDifference(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600));
  }

  /**
   * Get difference between two dates in minutes
   */
  public static getMinutesDifference(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 60));
  }

  /**
   * Format date to specified format
   */
  public static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Parse date string (ISO format)
   */
  public static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if date is in the past
   */
  public static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date is in the future
   */
  public static isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Check if date is today
   */
  public static isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  /**
   * Get start of day
   */
  public static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   */
  public static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Get date range for week
   */
  public static getWeekDateRange(date: Date): DateRange {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const startDate = new Date(curr.setDate(first));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return { startDate, endDate };
  }

  /**
   * Get date range for month
   */
  public static getMonthDateRange(date: Date): DateRange {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { startDate, endDate };
  }

  /**
   * Get date range for year
   */
  public static getYearDateRange(date: Date): DateRange {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const endDate = new Date(date.getFullYear(), 11, 31);
    return { startDate, endDate };
  }

  /**
   * Check if date is between two dates
   */
  public static isBetween(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  /**
   * Get milliseconds since epoch
   */
  public static getTimestampMs(): number {
    return Date.now();
  }

  /**
   * Get seconds since epoch
   */
  public static getTimestampSec(): number {
    return Math.floor(Date.now() / 1000);
  }
}
