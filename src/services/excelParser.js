import { read, utils } from 'xlsx';

/**
 * Pads a number with a leading zero if it's less than 10.
 * @param {number} num 
 * @returns {string}
 */
const padZero = (num) => String(num).padStart(2, '0');

/**
 * Checks if a format string represents a date.
 * @param {string} format 
 * @returns {boolean}
 */
const isDateFormat = (format) => {
  if (!format) return false;
  const f = format.toLowerCase();
  return /[yd]/.test(f) || (f.includes('m') && !f.includes('h') && !f.includes('s'));
};

/**
 * Checks if a format string represents a time.
 * @param {string} format 
 * @returns {boolean}
 */
const isTimeFormat = (format) => {
  if (!format) return false;
  const f = format.toLowerCase();
  return /[hs]/.test(f) || (f.includes('m') && (f.includes('h') || f.includes('s')));
};

/**
 * Checks if a cell is a date or time type.
 * @param {any} cell 
 * @returns {boolean}
 */
const isDateType = (cell) => {
  if (!cell) return false;
  return cell.t === 'd' || isDateFormat(cell.z) || isTimeFormat(cell.z);
};

/**
 * Formats a date as yyyy/mm/dd.
 * @param {Date|number|string} dateValue 
 * @returns {string}
 */
const formatDate = (dateValue) => {
  let date;
  if (typeof dateValue === 'number') {
    date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
  } else {
    date = new Date(dateValue);
  }

  if (isNaN(date.getTime())) return String(dateValue);
  
  const yyyy = date.getUTCFullYear();
  const mm = padZero(date.getUTCMonth() + 1);
  const dd = padZero(date.getUTCDate());
  
  return `${yyyy}/${mm}/${dd}`;
};

/**
 * Formats a time as hh:mm (24-hour).
 * @param {Date|number|string} dateValue 
 * @returns {string}
 */
const formatTime = (dateValue) => {
  let date;
  if (typeof dateValue === 'number') {
    // For pure time, dateValue is < 1. 
    // We can just use the fraction of the day.
    const totalSeconds = Math.round(dateValue * 86400);
    const hh = padZero(Math.floor(totalSeconds / 3600) % 24);
    const mm = padZero(Math.floor((totalSeconds % 3600) / 60));
    return `${hh}:${mm}`;
  } else {
    date = new Date(dateValue);
  }

  if (isNaN(date.getTime())) return String(dateValue);
  
  const hh = padZero(date.getUTCHours());
  const mm = padZero(date.getUTCMinutes());
  
  return `${hh}:${mm}`;
};

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
          const isDateOrTime = isDateType(cell);
          let value = cell.v;
          
          if (isDateOrTime) {
            if (isTimeFormat(cell.z) && !isDateFormat(cell.z)) {
              // US2: Standardize Time format
              value = formatTime(cell.v);
            } else {
              // US1: Standardize Date format
              value = formatDate(cell.v);
            }
          }
          
          cellData[r][c] = {
            v: isDateOrTime ? value : cell.v,
            t: isDateOrTime ? 's' : cell.t,
            s: cell.s,
            z: cell.z, // Preserve number format
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
          ws[address] = { 
            v: cell.v, 
            t: typeof cell.v === 'number' ? 'n' : 's',
            z: cell.z, // Preserve number format on export
          };
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
  return read(data, {
    cellNF: true,
    cellText: true,
    cellDates: true,
  });
};