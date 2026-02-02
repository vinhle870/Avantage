declare module './fileReader' {
  export function parsePropertiesFile(filePath: string): Record<string, string>;
  export function parseEnvFile(filePath: string): Record<string, string>;
  export function readJsonFile(filePath: string): any;
  export function writeJsonFile(filePath: string, data: any): void;
  export function fileExists(filePath: string): boolean;
  export function getFilesInDirectory(dirPath: string, extension?: string): string[];
}
