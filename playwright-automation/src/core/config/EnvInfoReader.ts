/**
 * Environment Info Reader
 * Reads test data from environment XML files
 */

import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { GlobalConfigsReader } from './GlobalConfigsReader';

export interface PortalData {
  url: string;
  username: string;
  password: string;
}

export interface EnvInfo {
  adminPortal: PortalData;
  dealerPortal: PortalData;
}

class EnvInfoReaderClass {
  private static instance: EnvInfoReaderClass;
  private envInfo: EnvInfo | null = null;

  private constructor() {
    this.loadEnvInfo();
  }

  public static getInstance(): EnvInfoReaderClass {
    if (!EnvInfoReaderClass.instance) {
      EnvInfoReaderClass.instance = new EnvInfoReaderClass();
    }
    return EnvInfoReaderClass.instance;
  }

  private getEnvInfoFile(): string {
    const envName = GlobalConfigsReader.getEnvName();
    const envInfoUrl = GlobalConfigsReader.getEnvInfoUrl();

    const fileName = envName === 'PROD' ? 'PROD_TestData.xml' : 'Staging_TestData.xml';
    return path.join(envInfoUrl, fileName);
  }

  private async loadEnvInfo(): Promise<void> {
    try {
      const filePath = this.getEnvInfoFile();
      const xmlContent = fs.readFileSync(filePath, 'utf-8');
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(xmlContent);

      const adminPortal = result.Data.AdminPortal[0];
      const dealerPortal = result.Data.DealerPortal[0];

      this.envInfo = {
        adminPortal: {
          url: adminPortal.Url[0],
          username: adminPortal.Username[0],
          password: adminPortal.Password[0],
        },
        dealerPortal: {
          url: dealerPortal.Url[0],
          username: dealerPortal.Username[0],
          password: dealerPortal.Password[0],
        },
      };
    } catch (error) {
      console.error('Error loading environment info:', error);
      throw error;
    }
  }

  public getAdminData(): PortalData {
    if (!this.envInfo) {
      throw new Error('Environment info not loaded');
    }
    return this.envInfo.adminPortal;
  }

  public getDealerData(): PortalData {
    if (!this.envInfo) {
      throw new Error('Environment info not loaded');
    }
    return this.envInfo.dealerPortal;
  }

  public getEnvInfo(): EnvInfo {
    if (!this.envInfo) {
      throw new Error('Environment info not loaded');
    }
    return this.envInfo;
  }
}

export const EnvInfoReader = EnvInfoReaderClass.getInstance();
