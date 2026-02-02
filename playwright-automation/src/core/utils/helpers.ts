/**
 * Helper utility functions for tests
 */

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a random email address
 */
export function generateRandomEmail(domain: string = 'test.com'): string {
    return `test_${generateRandomString(8)}@${domain}`;
}

/**
 * Generate a random VIN (Vehicle Identification Number)
 * Note: This generates a random string, not a valid VIN
 */
export function generateRandomVin(): string {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    let vin = '';
    for (let i = 0; i < 17; i++) {
        vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export function getTodayFormatted(): string {
    return formatDate(new Date());
}

/**
 * Get a future date formatted as YYYY-MM-DD
 */
export function getFutureDateFormatted(daysAhead: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return formatDate(date);
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, locale: string = 'en-CA'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
    }).format(value);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
}

/**
 * Wait for a condition with timeout
 */
export async function waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await condition()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return false;
}

/**
 * Sleep for specified milliseconds
 * Use sparingly - prefer Playwright's auto-wait mechanisms
 */
export async function sleep(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
}
