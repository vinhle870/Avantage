# Quick Reference - TypeScript Conversions

## Import Statements

### Configuration
```typescript
import { GlobalConfigsReader } from 'src/core/config';
import { EnvInfoReader } from 'src/core/config';
import { DataFileReader } from 'src/core/config';
```

### Managers
```typescript
import { AppDriverFactory } from 'src/core/managers';
import { TestControl } from 'src/core/managers';
import { CapacitiesFactory } from 'src/core/managers';
```

### Utilities
```typescript
import { BrowserHelper } from 'src/core/utils';
import { FileManager } from 'src/core/utils';
import { DateTimeManager } from 'src/core/utils';
import { DataOptimizer } from 'src/core/utils';
import { DataValidator } from 'src/core/utils';
import * as CustomFuncs from 'src/core/utils/customFunctions';
```

### Data Models
```typescript
import {
  Dealer, DealerInfo, PriceRule, Program, AdminPortal
} from 'src/data';
import {
  QuoteInfo, QuoteClient, VehicleInfo, DealerPortal
} from 'src/data';
```

### AI Agents
```typescript
import { AIAgentManager } from 'src/core/agents';
import { AgentPrompts } from 'src/core/agents';
import { AgentPromptLibrary } from 'src/core/agents';
```

---

## Common Patterns

### Test Setup
```typescript
import { test } from '@playwright/test';
import { TestControl } from 'src/core/managers';

test('Test Name', async () => {
  const ctrl = TestControl.getInstance();
  await ctrl.initializeTest('Test Name');
  try {
    // Test code
    ctrl.markTestPassed();
  } catch (e) {
    ctrl.markTestFailed(e.message);
  } finally {
    await ctrl.cleanupTest();
  }
});
```

### Browser Navigation
```typescript
const factory = AppDriverFactory.getInstance();
const driver = factory.createAppDriver();
await driver.launch();
await driver.createPage();
await driver.navigateTo('https://example.com');
const page = driver.getPage();
```

### Load Configuration
```typescript
const config = GlobalConfigsReader.getConfig();
const adminCreds = EnvInfoReader.getAdminData();
const testData = DataFileReader.getAllTestData('testdata.json');
```

### File Operations
```typescript
FileManager.writeFile('/path/to/file.txt', 'content');
const content = FileManager.readFile('/path/to/file.txt');
FileManager.deleteFile('/path/to/file.txt');
FileManager.copyFile('/source', '/dest');
```

### Date Operations
```typescript
const tomorrow = DateTimeManager.addDays(new Date(), 1);
const formatted = DateTimeManager.formatDate(new Date(), 'YYYY-MM-DD');
const diff = DateTimeManager.getDaysDifference(date1, date2);
```

### Data Manipulation
```typescript
const unique = DataOptimizer.removeDuplicates(items);
const sorted = DataOptimizer.sortBy(items, 'name', true);
const grouped = DataOptimizer.groupBy(items, 'category');
const chunked = DataOptimizer.chunk(items, 10);
```

### Data Validation
```typescript
if (DataValidator.isValidEmail(email)) { /* ... */ }
if (DataValidator.hasRequiredFields(obj, ['name', 'email'])) { /* ... */ }
if (DataValidator.validateSchema(obj, { name: 'string', age: 'number' })) { /* ... */ }
```

### AI Agent
```typescript
const aiManager = AIAgentManager.getInstance();
const response = await aiManager.generateTestCase({
  testName: 'Test_Login',
  pageType: 'LoginPage'
});
console.log(response.content);
```

---

## Key Methods Reference

### GlobalConfigsReader
- `getEnvName()` → string
- `getBrowsers()` → string[]
- `getPrimaryBrowser()` → string
- `isHeadlessMode()` → boolean
- `getWaitTime()` → number
- `getConfig()` → GlobalConfig

### EnvInfoReader
- `getAdminData()` → PortalData
- `getDealerData()` → PortalData
- `getEnvInfo()` → EnvInfo

### DataFileReader
- `loadJsonTestData(fileName)` → any
- `getTestObject(fileName, objectName)` → any
- `getAllTestData(fileName)` → any

### AppDriver
- `launch()` → Promise<void>
- `createPage()` → Promise<Page>
- `navigateTo(url)` → Promise<void>
- `getPage()` → Page
- `closeAll()` → Promise<void>

### TestControl
- `initializeTest(testName)` → Promise<void>
- `cleanupTest()` → Promise<void>
- `markTestPassed()` → void
- `markTestFailed(error)` → void
- `getTestStatistics()` → Statistics

### BrowserHelper
- `takeScreenshot(filename)` → Promise<Buffer>
- `getPageTitle()` → Promise<string>
- `getCurrentUrl()` → Promise<string>
- `scrollToElement(selector)` → Promise<void>
- `uploadFile(selector, filePath)` → Promise<void>

### FileManager
- `fileExists(path)` → boolean
- `writeFile(path, content)` → void
- `readFile(path)` → string
- `listFiles(dir, ext?)` → string[]
- `deleteFile(path)` → void
- `copyFile(src, dest)` → void

### DateTimeManager
- `addDays(date, days)` → Date
- `formatDate(date, format?)` → string
- `getDaysDifference(d1, d2)` → number
- `getMonthDateRange(date)` → DateRange

### DataOptimizer
- `removeDuplicates<T>(array, key?)` → T[]
- `sortBy<T>(array, key, ascending?)` → T[]
- `groupBy<T>(array, key)` → Map
- `chunk<T>(array, size)` → T[][]
- `paginate<T>(array, page, size)` → T[]

---

## File Organization

```
Config Files:
  src/test/resources/EnvInfo/
    ├── Exec_Config.properties
    ├── Staging_TestData.xml
    └── PROD_TestData.xml

Test Data:
  src/test/resources/TestCaseData/
    └── *.json, *.xml files

Downloaded Files:
  src/test/resources/TestDocument/
    └── downloaded test files
```

---

## Singleton Instances

```typescript
// Get singleton instances
const config = GlobalConfigsReader.getInstance();
const envReader = EnvInfoReader.getInstance();
const dataReader = DataFileReader.getInstance();
const factory = AppDriverFactory.getInstance();
const testCtrl = TestControl.getInstance();
const aiManager = AIAgentManager.getInstance();
const capFactory = CapacitiesFactory.getInstance();
```

---

## Common Errors & Solutions

### Error: "Cannot find module"
**Solution**: Check import path starts with `src/` and uses forward slashes

### Error: "Config not loading"
**Solution**: Verify `Exec_Config.properties` exists in `src/test/resources/EnvInfo/`

### Error: "Page not created"
**Solution**: Call `driver.createPage()` before `driver.getPage()`

### Error: "Environment info not loaded"
**Solution**: Ensure XML file exists and config references correct environment

---

## Type Definitions

```typescript
// Portal credentials
interface PortalData {
  url: string;
  username: string;
  password: string;
}

// Quote information
interface QuoteInfo {
  id?: string;
  quoteNumber?: string;
  quoteDate: Date;
  quoteClient: QuoteClient;
  quoteVehicle: QuoteVehicle;
  // ... more fields
}

// Test execution context
interface TestExecutionContext {
  testName: string;
  startTime: Date;
  endTime?: Date;
  status: 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  errorMessage?: string;
}

// AI Agent response
interface AgentResponse {
  success: boolean;
  content: string;
  promptUsed: string;
  timestamp: Date;
  tokens?: { input: number; output: number };
}
```

---

## Environment Variables

```bash
# Set in .env or system environment
TIMEOUT=30000
HEADLESS=true
BROWSER=chrome
ENV_NAME=Staging
```

---

## Tips & Tricks

1. **Use retry with backoff for flaky tests**
   ```typescript
   await testCtrl.retryOperation(() => clickButton(), 3, 1000);
   ```

2. **Generate unique IDs for test data**
   ```typescript
   const uniqueId = CustomFuncs.generateUniqueId();
   ```

3. **Format numbers consistently**
   ```typescript
   const formatted = CustomFuncs.formatNumber(1234.56);
   ```

4. **Wait intelligently**
   ```typescript
   await CustomFuncs.sleep(2000); // 2 seconds
   ```

5. **Validate before processing**
   ```typescript
   if (DataValidator.isValidEmail(email)) { /* process */ }
   ```

---

## Deprecated (Java) → New (TypeScript)

| Old | New |
|-----|-----|
| GlobalConfigsReader.getInstance().EnvName | GlobalConfigsReader.getEnvName() |
| GlobalConfigsReader.getInstance().Browsers | GlobalConfigsReader.getBrowsers() |
| GlobalConfigsReader.getInstance().WaitTime | GlobalConfigsReader.getWaitTime() |
| EnvInfoReader().admin | EnvInfoReader.getAdminData() |
| BrowserHelper.saveSourcePage() | BrowserHelper.savePageSource() |
| Custom_Func.randomNumber() | CustomFuncs.randomNumber() |
| Custom_Func.GetOS_func() | CustomFuncs.getOS() |

---

## Resources

- **Full Guide**: See `CONVERSION_GUIDE.md`
- **API Docs**: Check JSDoc in each TypeScript file
- **Examples**: See usage in test files
- **Troubleshooting**: See individual module documentation

---

*Last Updated: February 1, 2026*
