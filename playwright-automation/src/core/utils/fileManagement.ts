/**
 * File Management Utilities
 * File operations and utilities
 */

import * as fs from 'fs';
import * as path from 'path';

export class FileManager {
  /**
   * Check if file exists
   */
  public static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Create directory (recursive)
   */
  public static createDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Write file
   */
  public static writeFile(filePath: string, content: string | Buffer): void {
    const dir = path.dirname(filePath);
    this.createDirectory(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Read file
   */
  public static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Read file as buffer
   */
  public static readFileAsBuffer(filePath: string): Buffer {
    return fs.readFileSync(filePath);
  }

  /**
   * Append to file
   */
  public static appendToFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    this.createDirectory(dir);
    fs.appendFileSync(filePath, content, 'utf-8');
  }

  /**
   * Delete file
   */
  public static deleteFile(filePath: string): void {
    if (this.fileExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Delete directory (recursive)
   */
  public static deleteDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /**
   * Copy file
   */
  public static copyFile(sourcePath: string, destPath: string): void {
    const dir = path.dirname(destPath);
    this.createDirectory(dir);
    fs.copyFileSync(sourcePath, destPath);
  }

  /**
   * Copy directory (recursive)
   */
  public static copyDirectory(sourcePath: string, destPath: string): void {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    const files = fs.readdirSync(sourcePath);
    files.forEach(file => {
      const sourceFile = path.join(sourcePath, file);
      const destFile = path.join(destPath, file);

      if (fs.statSync(sourceFile).isDirectory()) {
        this.copyDirectory(sourceFile, destFile);
      } else {
        this.copyFile(sourceFile, destFile);
      }
    });
  }

  /**
   * Move/Rename file
   */
  public static moveFile(sourcePath: string, destPath: string): void {
    const dir = path.dirname(destPath);
    this.createDirectory(dir);
    fs.renameSync(sourcePath, destPath);
  }

  /**
   * List files in directory
   */
  public static listFiles(dirPath: string, extension?: string): string[] {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);
    let result = files.filter(file => {
      const filePath = path.join(dirPath, file);
      return fs.statSync(filePath).isFile();
    });

    if (extension) {
      result = result.filter(file => file.endsWith(extension));
    }

    return result;
  }

  /**
   * List directories in directory
   */
  public static listDirectories(dirPath: string): string[] {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const items = fs.readdirSync(dirPath);
    return items.filter(item => {
      const itemPath = path.join(dirPath, item);
      return fs.statSync(itemPath).isDirectory();
    });
  }

  /**
   * Get file size in bytes
   */
  public static getFileSize(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  /**
   * Get file size in human readable format
   */
  public static getFileSizeHuman(filePath: string): string {
    const bytes = this.getFileSize(filePath);
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get file extension
   */
  public static getFileExtension(filePath: string): string {
    return path.extname(filePath).substring(1);
  }

  /**
   * Get file name without extension
   */
  public static getFileNameWithoutExtension(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Get file name with extension
   */
  public static getFileName(filePath: string): string {
    return path.basename(filePath);
  }

  /**
   * Get directory name
   */
  public static getDirectoryName(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Get absolute path
   */
  public static getAbsolutePath(filePath: string): string {
    return path.resolve(filePath);
  }

  /**
   * Check if path is directory
   */
  public static isDirectory(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  }

  /**
   * Check if path is file
   */
  public static isFile(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  }

  /**
   * Get file stats
   */
  public static getFileStats(filePath: string): fs.Stats {
    return fs.statSync(filePath);
  }
}
