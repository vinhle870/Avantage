# Syntax Error Tracking

**Date:** February 1, 2026
**Last Updated:** Post smoke-test validation
**Status:** Errors identified and catalogued

---

## Summary

- **Java Errors:** 16 files with compile/warning issues
- **TypeScript Errors:** 5 files with module/type issues
- **Total Error Count:** 35+ individual issues

---

## Java Compilation Errors

### 1. [src/test/java/core/components/table/tableImpl.java](src/test/java/core/components/table/tableImpl.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 11 | Redundant superinterface `iBaseComponent` (already defined by `iTable`) | Compile | High |
| 23 | Unused local variable `e` | Warning | Medium |
| 28 | Unused local variable `e` | Warning | Medium |

**Fix:** Remove `iBaseComponent` from implements clause; remove/use variable `e`.

---

### 2. [src/test/java/ProjectContext/dataReader/EnvInfoReader.java](src/test/java/ProjectContext/dataReader/EnvInfoReader.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 25 | Static field `GlobalConfigsReader.EnvName` accessed non-statically | Compile | High |

**Fix:** Change `GlobalConfigsReader.getInstance().EnvName` to `GlobalConfigsReader.EnvName`.

---

### 3. [src/test/java/ProjectContext/BusinessObject/Pdf/WarrantyPdf.java](src/test/java/ProjectContext/BusinessObject/Pdf/WarrantyPdf.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 3 | Unused import `jakarta.xml.bind.annotation.XmlElement` | Warning | Low |

**Fix:** Remove unused import.

---

### 4. [src/test/java/core/configuration/browsercapacities/browserCapacities.java](src/test/java/core/configuration/browsercapacities/browserCapacities.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 5 | Unused import `java.util.ArrayList` | Warning | Low |

**Fix:** Remove unused import.

---

### 5. [src/test/java/core/components/baseComponent/baseComponent.java](src/test/java/core/components/baseComponent/baseComponent.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 75 | Unused private method `setElement(By)` | Warning | Medium |
| 227 | Static field `GlobalConfigsReader.WaitTime` accessed non-statically | Compile | High |
| 229 | Unused local variable `e` | Warning | Medium |
| 243 | Static field `GlobalConfigsReader.WaitTime` accessed non-statically | Compile | High |
| 245 | Unused local variable `e` | Warning | Medium |
| 280 | Unused local variable `max_y` | Warning | Medium |

**Fix:** Remove unused method/variables; change `getInstance().WaitTime` to `WaitTime` (static).

---

### 6. [src/test/java/ProjectContext/pageObject/dealerPortal/warrantyDetails_Page/WarrantyDetailsPage_Func.java](src/test/java/ProjectContext/pageObject/dealerPortal/warrantyDetails_Page/WarrantyDetailsPage_Func.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 31 | Unused local variable `isExpaned` | Warning | Medium |

**Fix:** Remove/use variable `isExpaned`.

---

### 7. [src/test/java/testcases/TestBase.java](src/test/java/testcases/TestBase.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 7 | Unused import `core.browser.Browser` | Warning | Low |

**Fix:** Remove unused import.

---

### 8. [src/test/java/core/assertion/TestAssertions.java](src/test/java/core/assertion/TestAssertions.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 13 | Enum switch missing case label for `CONTINUE_RUN` | Compile | High |

**Fix:** Add case for `CONTINUE_RUN` in switch statement.

---

### 9. [src/test/java/core/configuration/SeleniumDriver/SeleniumDriver.java](src/test/java/core/configuration/SeleniumDriver/SeleniumDriver.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 19 | Redundant superinterface `ApplicationDriver` (already defined by `DriverBase`) | Compile | High |

**Fix:** Remove `ApplicationDriver` from implements clause.

---

### 10. [src/test/java/ProjectContext/pageObject/adminPortal/programManage/landingProgramPage/Admin_ProgramPageFunc.java](src/test/java/ProjectContext/pageObject/adminPortal/programManage/landingProgramPage/Admin_ProgramPageFunc.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 11 | Static method `lnk_AddNew()` accessed non-statically | Compile | High |
| 15 | Static method `tbl_ProgramList()` accessed non-statically | Compile | High |
| 19 | Static method `tbl_ProgramList()` accessed non-statically | Compile | High |

**Fix:** Change `page.lnk_AddNew()` → `Admin_ProgramsPage.lnk_AddNew()` (static calls).

---

### 11. [src/test/java/ProjectContext/pageObject/adminPortal/programManage/progOptionDetail_Mdal/ProgOptionDetail_Mdal_Func.java](src/test/java/ProjectContext/pageObject/adminPortal/programManage/progOptionDetail_Mdal/ProgOptionDetail_Mdal_Func.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 11 | Static method `txt_Name()` accessed non-statically | Compile | High |
| 13 | Static method `txt_Code()` accessed non-statically | Compile | High |
| 16 | Static method `btn_Save()` accessed non-statically | Compile | High |

**Fix:** Change `model.txt_Name()` → `ProgOptionDetail_Mdal.txt_Name()` (static calls).

---

### 12. [src/test/java/core/browser/Browser.java](src/test/java/core/browser/Browser.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 25 | Static field `GlobalConfigsReader.headlessMode` accessed non-statically | Compile | High |
| 52 | Static field `GlobalConfigsReader.CloseBrowser` accessed non-statically | Compile | High |

**Fix:** Change `getInstance().headlessMode` → `GlobalConfigsReader.headlessMode` (static).

---

### 13. [src/test/java/ProjectContext/dataReader/GlobalConfigsReader.java](src/test/java/ProjectContext/dataReader/GlobalConfigsReader.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 24 | Unused field `envFileReader` | Warning | Low |
| 70 | Static field `Browsers` accessed non-statically | Compile | High |

**Fix:** Remove unused field; change `getInstance().Browsers` → `GlobalConfigsReader.Browsers`.

---

### 14. [src/test/java/ProjectContext/custom_Func/DateTime_Manage.java](src/test/java/ProjectContext/custom_Func/DateTime_Manage.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 239 | Deprecated method `Date.setDate(int)` | Warning | Medium |
| 239 | Deprecated method `Date.getDate()` | Warning | Medium |

**Fix:** Use `java.time.LocalDate` or `Calendar` instead of deprecated `java.util.Date` methods.

---

### 15. [src/test/java/core/components/datepicker/DatePickerImpl.java](src/test/java/core/components/datepicker/DatePickerImpl.java)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 8 | Unused import `org.openqa.selenium.WebElement` | Warning | Low |

**Fix:** Remove unused import.

---

## TypeScript Compilation Errors

### 1. [playwright-automation/src/core/config/GlobalConfigsReader.ts](playwright-automation/src/core/config/GlobalConfigsReader.ts)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 8 | Cannot find module `./fileReader` or type declarations | Compile | High |
| 48 | Parameter `b` implicitly has type `any` | Compile | Medium |

**Fix / Status:**
- The implicit `any` for the `.map()` callback was fixed by adding an explicit parameter type `(b: string) => b.trim()` in `GlobalConfigsReader.ts`.
- The import path `./fileReader` is present in the repo. If TypeScript still reports a missing module during compilation, run `npm install` and `npx tsc --noEmit` to refresh type resolution.

---

### 2. [playwright-automation/src/core/config/EnvInfoReader.ts](playwright-automation/src/core/config/EnvInfoReader.ts)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 8 | Cannot find module `xml2js` or its corresponding type declarations | Compile | High |

**Fix / Status:**
- Added `xml2js` and `@types/xml2js` to `package.json` devDependencies. Run `npm install` to fetch packages and resolve this error locally.

---

### 3. [playwright-automation/src/core/config/DataFileReader.ts](playwright-automation/src/core/config/DataFileReader.ts)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 8 | Cannot find module `xml2js` or its corresponding type declarations | Compile | High |

**Fix / Status:**
- Added `xml2js` and `@types/xml2js` to `package.json` devDependencies. Run `npm install` to fetch packages and resolve this error locally.

---

### 4. [playwright-automation/src/core/managers/CapacitiesFactory.ts](playwright-automation/src/core/managers/CapacitiesFactory.ts)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 6 | Module `@playwright/test` has no exported member `BrowserName` | Compile | High |

**Fix / Status:**
- Replaced the non-existent import by defining a local `BrowserName` type alias (`'chromium'|'firefox'|'webkit'`) in `CapacitiesFactory.ts`.
- This issue is resolved in code.

---

### 5. [playwright-automation/src/core/utils/BrowserHelper.ts](playwright-automation/src/core/utils/BrowserHelper.ts)

| Line | Issue | Type | Severity |
|------|-------|------|----------|
| 155 | Spread argument must have tuple type or be passed to rest parameter | Compile | High |

**Fix / Status:**
- Adjusted `executeScript` to pass a single serializable object into `page.evaluate` (no spread), resolving the tuple/spread typing issue.
- This issue is resolved in code.

---

## Action Items

### High Priority (Blocking Builds)

- [ ] **TypeScript:** Install missing `xml2js` and `@types/xml2js` packages
- [ ] **TypeScript:** Fix `BrowserName` type in `CapacitiesFactory.ts`
- [ ] **TypeScript:** Verify `./fileReader` module exists in `GlobalConfigsReader.ts`
- [ ] **TypeScript:** Fix spread argument typing in `BrowserHelper.ts`
- [ ] **Java:** Fix static field access in 8+ files
- [ ] **Java:** Fix redundant superinterfaces in 2 files
- [ ] **Java:** Fix enum switch case in `TestAssertions.java`

### Medium Priority (Warnings)

- [ ] **Java:** Remove unused variables (baseComponent, WarrantyDetailsPage_Func, etc.)
- [ ] **Java:** Replace deprecated `Date` methods in `DateTime_Manage.java`
- [ ] **Java:** Remove unused imports in 4 files
- [ ] **TypeScript:** Add explicit type for `b` parameter in `GlobalConfigsReader.ts`

### Low Priority (Cleanup)

- [ ] **Java:** Remove unused method `setElement()` in `baseComponent.java`
- [ ] **Java:** Remove unused field `envFileReader` in `GlobalConfigsReader.java`

---

## Progress Log

| Date | Action | Status |
|------|--------|--------|
| 2026-02-01 | Error review and cataloguing | ✅ Complete |
| 2026-02-01 | Create error tracking doc | ✅ Complete |
| TBD | Fix TypeScript module errors | ⏳ Pending |
| TBD | Fix Java static access errors | ⏳ Pending |
| TBD | Verify clean build | ⏳ Pending |
