/**
 * Custom Utility Functions
 * Converted from Java Custom_Func class
 */

import * as os from 'os';
import { execSync } from 'child_process';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Generate random number
 */
export function randomNumber(min: number = 0, max: number = 99999): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random string of specified length
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get operating system
 * Returns: 'mac', 'win', or 'linux'
 */
export function getOS(): string {
  const platform = os.platform();
  if (platform === 'darwin') {
    return 'mac';
  } else if (platform === 'win32') {
    return 'win';
  } else {
    return 'linux';
  }
}

/**
 * Format number with thousand separators and decimals
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/**
 * Generate unique timestamp
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Add days to a date
 */
export function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get date difference in days
 */
export function getDateDifference(date1: Date, date2: Date): number {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Wait for specified milliseconds
 */
export async function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, i);
        await sleep(backoffDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Parse environment variable with default value
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || '';
}

/**
 * Convert string to boolean
 */
export function parseBoolean(value: string): boolean {
  return value?.toLowerCase() === 'true' || value === '1';
}

/**
 * Generate unique ID
 */
export function generateUniqueId(): string {
  return `${Date.now()}_${randomString(8)}`;
}

/**
 * Sanitize string for filename
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

/**
 * Execute shell command (platform specific)
 */
export function executeCommand(command: string): string {
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    return result.trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    throw error;
  }
}

/**
 * Mac-specific file upload automation
 * (Note: This is a JavaScript implementation, actual automation may vary)
 */
export async function macUploadFile(filePath: string): Promise<void> {
  if (getOS() !== 'mac') {
    throw new Error('This function is only for macOS');
  }

  try {
    // Copy file path to clipboard
    const command = `echo "${filePath}" | pbcopy`;
    executeCommand(command);

    // Note: Actual AppleScript execution would need to be done differently in Node.js
    // This is a placeholder for the Java implementation
    console.log(`File path copied to clipboard: ${filePath}`);
  } catch (error) {
    console.error('Error in macUploadFile:', error);
    throw error;
  }
}
