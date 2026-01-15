import { describe, it, expect } from 'vitest';
import { transformWorkbookToUniverData } from '../../src/services/excelParser';

describe('Excel Date/Time Final Fix Verification', () => {
  it('should verify that dates and times use formatted strings for display', () => {
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

    const result = transformWorkbookToUniverData(mockWorkbook);
    const sheet = Object.values(result.sheets)[0];

    // We now expect 'v' to be the formatted string 'w' to ensure display in UniverJS
    expect(sheet.cellData['0']['0'].v).toBe('2025/07/31');
    expect(sheet.cellData['0']['1'].v).toBe('18:21');
    
    // Type should be string
    expect(sheet.cellData['0']['0'].t).toBe('s');
    expect(sheet.cellData['0']['1'].t).toBe('s');
  });
});
