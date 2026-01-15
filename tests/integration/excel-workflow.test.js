import { describe, it, expect } from 'vitest';
import { transformWorkbookToUniverData, transformUniverDataToWorkbook } from '../../src/services/excelParser';

describe('Excel Workflow Integration', () => {
  it('should successfully round-trip data from XLSX to UniverJS and back to XLSX', () => {
    // 1. Simulate Import (XLSX -> UniverJS)
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': {
          '!ref': 'A1:A1',
          'A1': { v: 'Initial Value' }
        }
      }
    };
    
    const univerData = transformWorkbookToUniverData(mockWorkbook);
    expect(univerData.sheets['sheet-0'].cellData['0']['0'].v).toBe('Initial Value');

    // 2. Simulate Edit (In UniverJS)
    univerData.sheets['sheet-0'].cellData['0']['0'].v = 'Edited Value';

    // 3. Simulate Export (UniverJS -> XLSX)
    const exportedWorkbook = transformUniverDataToWorkbook(univerData);
    expect(exportedWorkbook.SheetNames).toContain('Sheet1');
    expect(exportedWorkbook.Sheets['Sheet1']['A1'].v).toBe('Edited Value');
  });

  it('should preserve date and time formats during round-trip', () => {
    // 1. Import
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': {
          '!ref': 'A1:B1',
          'A1': { v: 45869, t: 'n', z: 'yyyy/mm/dd', w: '2025/07/31' },
          'B1': { v: 0.7645833333333333, t: 'n', z: 'HH:mm', w: '18:21' }
        }
      }
    };

    const univerData = transformWorkbookToUniverData(mockWorkbook);
    expect(univerData.sheets['sheet-0'].cellData['0']['0'].v).toBe('2025/07/31');
    expect(univerData.sheets['sheet-0'].cellData['0']['0'].z).toBe('yyyy/mm/dd');
    expect(univerData.sheets['sheet-0'].cellData['0']['1'].v).toBe('18:21');
    expect(univerData.sheets['sheet-0'].cellData['0']['1'].z).toBe('HH:mm');

    // 2. Export
    const exportedWorkbook = transformUniverDataToWorkbook(univerData);
    expect(exportedWorkbook.Sheets['Sheet1']['A1'].v).toBe('2025/07/31');
    expect(exportedWorkbook.Sheets['Sheet1']['A1'].z).toBe('yyyy/mm/dd');
    expect(exportedWorkbook.Sheets['Sheet1']['B1'].v).toBe('18:21');
    expect(exportedWorkbook.Sheets['Sheet1']['B1'].z).toBe('HH:mm');
  });

  it('should standardize date format to yyyy/mm/dd on import', () => {
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': {
          '!ref': 'A1:A1',
          'A1': { v: new Date(2025, 6, 12), t: 'd', z: 'm/d/yy' }
        }
      }
    };

    const univerData = transformWorkbookToUniverData(mockWorkbook);
    expect(univerData.sheets['sheet-0'].cellData['0']['0'].v).toBe('2025/07/12');
  });

  it('should standardize time format to hh:mm on import', () => {
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': {
          '!ref': 'A1:A1',
          'A1': { v: 0.5625, t: 'n', z: 'h:mm AM/PM' } // 13:30
        }
      }
    };

    const univerData = transformWorkbookToUniverData(mockWorkbook);
    expect(univerData.sheets['sheet-0'].cellData['0']['0'].v).toBe('13:30');
  });
});
