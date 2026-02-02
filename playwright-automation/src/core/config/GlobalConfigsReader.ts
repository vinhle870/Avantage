/// <reference path="./fileReader.d.ts" />
/**
 * Global Configuration Reader
 * Reads and manages global test configuration from properties files
 */

import * as fs from 'fs';
import * as path from 'path';

// Local lightweight properties parser to avoid cross-module resolution issues
function parsePropertiesFile(filePath: string): Record<string, string> {
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

export interface GlobalConfig {
  envName: string;
  browsers: string[];
  headlessMode: boolean;
  waitTime: number;
  closeBrowser: boolean;
  testResourceUrl: string;
  testFileDownloadUrl: string;
  envInfoUrl: string;
}

class GlobalConfigsReaderClass {
  private static instance: GlobalConfigsReaderClass;
  private config: GlobalConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  public static getInstance(): GlobalConfigsReaderClass {
    if (!GlobalConfigsReaderClass.instance) {
      GlobalConfigsReaderClass.instance = new GlobalConfigsReaderClass();
    }
    return GlobalConfigsReaderClass.instance;
  }

  private loadConfiguration(): GlobalConfig {
    try {
      const projectRoot = process.cwd();
      const testResourceUrl = path.join(projectRoot, 'src', 'test', 'resources');
      const envInfoUrl = path.join(testResourceUrl, 'EnvInfo');

      // Load properties file
      const configPath = path.join(envInfoUrl, 'Exec_Config.properties');
      const properties = parsePropertiesFile(configPath);

      return {
        envName: properties['EnvName'] || 'Staging',
        browsers: (properties['Browsers'] || 'Chrome').split(',').map((b: string) => b.trim()),
        headlessMode: properties['HeadlessMode'] === 'true',
        waitTime: parseInt(properties['WaitTime'] || '10', 10),
        closeBrowser: properties['CloseBrowser'] === 'true',
        testResourceUrl,
        testFileDownloadUrl: path.join(testResourceUrl, 'TestDocument'),
        envInfoUrl,
      };
    } catch (error) {
      console.error('Error loading global configuration:', error);
      // Return default config
      return {
        envName: 'Staging',
        browsers: ['Chrome'],
        headlessMode: false,
        waitTime: 10,
        closeBrowser: true,
        testResourceUrl: 'src/test/resources',
        testFileDownloadUrl: 'src/test/resources/TestDocument',
        envInfoUrl: 'src/test/resources/EnvInfo',
      };
    }
  }

  public getEnvName(): string {
    return this.config.envName;
  }

  public getBrowsers(): string[] {
    return this.config.browsers;
  }

  public getPrimaryBrowser(): string {
    return this.config.browsers[0] || 'Chrome';
  }

  public isHeadlessMode(): boolean {
    return this.config.headlessMode;
  }

  public getWaitTime(): number {
    return this.config.waitTime;
  }

  public shouldCloseBrowser(): boolean {
    return this.config.closeBrowser;
  }

  public getTestResourceUrl(): string {
    return this.config.testResourceUrl;
  }

  public getTestFileDownloadUrl(): string {
    return this.config.testFileDownloadUrl;
  }

  public getEnvInfoUrl(): string {
    return this.config.envInfoUrl;
  }

  public getConfig(): GlobalConfig {
    return { ...this.config };
  }
}

export const GlobalConfigsReader = GlobalConfigsReaderClass.getInstance();
