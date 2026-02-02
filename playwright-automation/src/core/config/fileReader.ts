/**
 * File Reader Utilities
 * Utility functions for reading various file types
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Parse properties file into object
 * Format: key=value
 */
export function parsePropertiesFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result: Record<string, string> = {};

    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key) {
          result[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return result;
  } catch (error) {
    console.error(`Error reading properties file ${filePath}:`, error);
    return {};
  }
}

/**
 * Parse environment .env file into object
 * Format: KEY=VALUE
 */
export function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result: Record<string, string> = {};

    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key) {
          result[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return result;
  } catch (error) {
    console.error(`Error reading .env file ${filePath}:`, error);
    return {};
  }
}

/**
 * Read JSON file
 */
export function readJsonFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Write JSON file
 */
export function writeJsonFile(filePath: string, data: any): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Get all files in directory with extension
 */
export function getFilesInDirectory(dirPath: string, extension?: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);
    if (!extension) {
      return files;
    }

    return files.filter(file => file.endsWith(extension));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}
