import { describe, it, expect, vi } from 'vitest';
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
});
