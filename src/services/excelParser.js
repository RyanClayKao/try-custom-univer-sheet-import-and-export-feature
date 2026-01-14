import { read, utils } from 'xlsx';

/**
 * Transforms a SheetJS workbook to UniverJS WorkbookData.
 * @param {import('xlsx').WorkBook} workbook 
 * @returns {any} UniverJS WorkbookData
 */
export const transformWorkbookToUniverData = (workbook) => {
  const univerData = {
    id: 'workbook-' + Date.now(),
    name: workbook.SheetNames[0] || 'New Workbook',
    sheetOrder: [],
    sheets: {},
  };

  workbook.SheetNames.forEach((sheetName, index) => {
    const sheetId = 'sheet-' + index;
    univerData.sheetOrder.push(sheetId);
    
    const worksheet = workbook.Sheets[sheetName];
    const range = utils.decode_range(worksheet['!ref'] || 'A1');
    
    const cellData = {};
    for (let r = range.s.r; r <= range.e.r; r++) {
      cellData[r] = {};
      for (let c = range.s.c; c <= range.e.c; c++) {
        const address = utils.encode_cell({ r, c });
        const cell = worksheet[address];
        if (cell) {
          cellData[r][c] = {
            v: cell.v,
            t: cell.t,
            s: cell.s,
          };
        }
      }
    }

    univerData.sheets[sheetId] = {
      id: sheetId,
      name: sheetName,
      cellData,
      rowCount: Math.max(range.e.r + 1, 100),
      columnCount: Math.max(range.e.c + 1, 20),
    };
  });

  return univerData;
};

/**
 * Transforms UniverJS WorkbookData to a SheetJS workbook.
 * @param {any} univerData 
 * @returns {import('xlsx').WorkBook}
 */
export const transformUniverDataToWorkbook = (univerData) => {
  const wb = utils.book_new();

  Object.values(univerData.sheets).forEach((sheet) => {
    const sheetData = [];
    const cellData = sheet.cellData;
    
    // Find max row and col
    let maxR = 0;
    let maxC = 0;
    Object.keys(cellData).forEach(r => {
      maxR = Math.max(maxR, parseInt(r));
      Object.keys(cellData[r]).forEach(c => {
        maxC = Math.max(maxC, parseInt(c));
      });
    });

    const ws = {};
    for (let r = 0; r <= maxR; r++) {
      if (!cellData[r]) continue;
      for (let c = 0; c <= maxC; c++) {
        const cell = cellData[r][c];
        if (cell && cell.v !== undefined) {
          const address = utils.encode_cell({ r, c });
          ws[address] = { v: cell.v, t: typeof cell.v === 'number' ? 'n' : 's' };
        }
      }
    }
    
    ws['!ref'] = utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxR, c: maxC } });
    utils.book_append_sheet(wb, ws, sheet.name);
  });

  return wb;
};

/**
 * Parses a file into a SheetJS Workbook.
 * @param {File} file 
 * @returns {Promise<import('xlsx').WorkBook>}
 */
export const parseFileToWorkbook = async (file) => {
  const data = await file.arrayBuffer();
  return read(data);
};