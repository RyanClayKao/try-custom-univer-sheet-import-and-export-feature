import { describe, it, expect } from 'vitest';
import { transformWorkbookToUniverData, transformUniverDataToWorkbook } from '../../src/services/excelParser';

describe('excelParser', () => {
  describe('transformWorkbookToUniverData', () => {
    it('should transform a simple SheetJS workbook to UniverJS data', () => {
      // Mock SheetJS Workbook
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          'Sheet1': {
            '!ref': 'A1:B2',
            'A1': { v: 'Name' },
            'B1': { v: 'Age' },
            'A2': { v: 'John' },
            'B2': { v: 30 }
          }
        }
      };

      const result = transformWorkbookToUniverData(mockWorkbook);

      expect(result).toBeDefined();
      expect(result.name).toBe('Sheet1');
      expect(result.sheets).toBeDefined();
      const sheet = Object.values(result.sheets)[0];
      expect(sheet.name).toBe('Sheet1');
      expect(sheet.cellData['0']['0'].v).toBe('Name');
      expect(sheet.cellData['0']['1'].v).toBe('Age');
      expect(sheet.cellData['1']['0'].v).toBe('John');
      expect(sheet.cellData['1']['1'].v).toBe(30);
    });
  });

  describe('transformUniverDataToWorkbook', () => {
    it('should transform UniverJS data back to a SheetJS workbook', () => {
      const univerData = {
        name: 'MyWorkbook',
        sheets: {
          'sheet1': {
            name: 'Sheet1',
            cellData: {
              '0': {
                '0': { v: 'Name' },
                '1': { v: 'Age' }
              },
              '1': {
                '0': { v: 'John' },
                '1': { v: 30 }
              }
            },
            rowCount: 100,
            columnCount: 20
          }
        }
      };

      const result = transformUniverDataToWorkbook(univerData);

      expect(result.SheetNames).toContain('Sheet1');
      const ws = result.Sheets['Sheet1'];
      expect(ws['A1'].v).toBe('Name');
      expect(ws['B1'].v).toBe('Age');
      expect(ws['A2'].v).toBe('John');
      expect(ws['B2'].v).toBe(30);
    });
  });
});
