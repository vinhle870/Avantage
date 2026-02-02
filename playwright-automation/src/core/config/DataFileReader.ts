/**
 * Data File Reader
 * Reads test data from JSON and XML files
 */

import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { readJsonFile } from './fileReader';
import { GlobalConfigsReader } from './GlobalConfigsReader';

interface TestDataObject {
  [key: string]: any;
}

class DataFileReaderClass {
  private static instance: DataFileReaderClass;
  private testDataCache: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): DataFileReaderClass {
    if (!DataFileReaderClass.instance) {
      DataFileReaderClass.instance = new DataFileReaderClass();
    }
    return DataFileReaderClass.instance;
  }

  /**
   * Load test data from JSON file
   */
  public loadJsonTestData(fileName: string): any {
    const cacheKey = `json_${fileName}`;
    if (this.testDataCache.has(cacheKey)) {
      return this.testDataCache.get(cacheKey);
    }

    try {
      const testDataPath = path.join(GlobalConfigsReader.getTestResourceUrl(), 'TestCaseData', fileName);
      const data = readJsonFile(testDataPath);
      this.testDataCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error loading test data from ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Load test data from XML file
   */
  public async loadXmlTestData(fileName: string): Promise<any> {
    const cacheKey = `xml_${fileName}`;
    if (this.testDataCache.has(cacheKey)) {
      return this.testDataCache.get(cacheKey);
    }

    try {
      const testDataPath = path.join(GlobalConfigsReader.getTestResourceUrl(), 'TestCaseData', fileName);
      const xmlContent = fs.readFileSync(testDataPath, 'utf-8');
      const parser = new xml2js.Parser();
      const data = await parser.parseStringPromise(xmlContent);
      this.testDataCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error loading test data from ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Get specific test data object by name
   */
  public getTestObject(fileName: string, objectName: string): TestDataObject {
    const data = this.loadJsonTestData(fileName);
    return data[objectName] || null;
  }

  /**
   * Get multiple test objects
   */
  public getTestObjects(fileName: string, objectNames: string[]): TestDataObject[] {
    const data = this.loadJsonTestData(fileName);
    return objectNames.map(name => data[name]).filter(obj => obj !== undefined);
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.testDataCache.clear();
  }

  /**
   * Get all test data from file
   */
  public getAllTestData(fileName: string): any {
    return this.loadJsonTestData(fileName);
  }
}

export const DataFileReader = DataFileReaderClass.getInstance();
