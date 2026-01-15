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

    it('should use formatted strings for date and time cells', () => {
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

      expect(sheet.cellData['0']['0'].v).toBe('2025/07/31');
      expect(sheet.cellData['0']['0'].z).toBe('yyyy/mm/dd');
      expect(sheet.cellData['0']['0'].t).toBe('s');
      
      expect(sheet.cellData['0']['1'].v).toBe('18:21');
      expect(sheet.cellData['0']['1'].z).toBe('HH:mm');
      expect(sheet.cellData['0']['1'].t).toBe('s');
    });

    it('should format dates as yyyy/mm/dd', () => {
      const date = new Date(2025, 6, 12); // July 12, 2025
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          'Sheet1': {
            '!ref': 'A1:A1',
            'A1': { v: date, t: 'd', z: 'm/d/yy' }
          }
        }
      };

      const result = transformWorkbookToUniverData(mockWorkbook);
      const sheet = Object.values(result.sheets)[0];

      expect(sheet.cellData['0']['0'].v).toBe('2025/07/12');
      expect(sheet.cellData['0']['0'].t).toBe('s');
    });

    it('should format times as hh:mm', () => {
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          'Sheet1': {
            '!ref': 'A1:A1',
            'A1': { v: 0.5625, t: 'n', z: 'h:mm AM/PM' } // 13:30
          }
        }
      };

      const result = transformWorkbookToUniverData(mockWorkbook);
      const sheet = Object.values(result.sheets)[0];

      expect(sheet.cellData['0']['0'].v).toBe('13:30');
      expect(sheet.cellData['0']['0'].t).toBe('s');
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
