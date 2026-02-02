/**
 * Data Management Utilities
 * Handles database, data optimization, and data manipulation
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/**
 * Database Management Class
 */
export class DatabaseManager {
  private config: DatabaseConfig;
  private connection: any = null;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Connect to database
   */
  public async connect(): Promise<void> {
    try {
      // Placeholder for database connection logic
      // In a real implementation, you would use a database driver like mysql, pg, etc.
      console.log(`Connecting to database: ${this.config.host}:${this.config.port}/${this.config.database}`);
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  /**
   * Execute query
   */
  public async executeQuery(query: string, params?: any[]): Promise<any> {
    try {
      if (!this.connection) {
        throw new Error('Not connected to database');
      }
      // Placeholder for query execution
      console.log(`Executing query: ${query}`);
      return null;
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        // Placeholder for disconnection logic
        this.connection = null;
        console.log('Database disconnected');
      }
    } catch (error) {
      console.error('Disconnection error:', error);
      throw error;
    }
  }
}

/**
 * Data Optimization Class
 * Utilities for data transformation and optimization
 */
export class DataOptimizer {
  /**
   * Remove duplicate objects from array
   */
  public static removeDuplicates<T>(array: T[], key?: keyof T): T[] {
    if (!key) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  /**
   * Filter objects by criteria
   */
  public static filterByPredicate<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
  }

  /**
   * Sort array of objects by property
   */
  public static sortBy<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) {
        return ascending ? -1 : 1;
      }
      if (aVal > bVal) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Group array of objects by property
   */
  public static groupBy<T>(array: T[], key: keyof T): Map<any, T[]> {
    const grouped = new Map<any, T[]>();

    array.forEach(item => {
      const groupKey = item[key];
      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, []);
      }
      grouped.get(groupKey)!.push(item);
    });

    return grouped;
  }

  /**
   * Map array to specific fields
   */
  public static pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
    return array.map(item => item[key]);
  }

  /**
   * Flatten nested array
   */
  public static flatten<T>(array: any[]): T[] {
    return array.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
    }, []);
  }

  /**
   * Chunk array into smaller arrays
   */
  public static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Paginate array
   */
  public static paginate<T>(array: T[], page: number, pageSize: number): T[] {
    const startIndex = (page - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  }
}

/**
 * Data Validation Class
 */
export class DataValidator {
  /**
   * Validate email format
   */
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number
   */
  public static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL
   */
  public static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate required fields
   */
  public static hasRequiredFields(obj: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => obj[field] !== undefined && obj[field] !== null && obj[field] !== '');
  }

  /**
   * Validate object structure
   */
  public static validateSchema<T>(obj: any, schema: Record<string, string>): boolean {
    for (const [field, type] of Object.entries(schema)) {
      if (typeof obj[field] !== type) {
        console.error(`Field ${field} is not of type ${type}`);
        return false;
      }
    }
    return true;
  }
}
