import { writeFileXLSX } from 'xlsx';
import { transformUniverDataToWorkbook } from '../../services/excelParser';

const ExportButton = ({ getUniverAPI }) => {
  const handleExport = () => {
    const univerAPI = getUniverAPI();
    if (!univerAPI) {
      alert('Editor not ready');
      return;
    }

    try {
      const activeWorkbook = univerAPI.getActiveWorkbook();
      if (!activeWorkbook) {
        alert('No active workbook to export');
        return;
      }

      const univerData = activeWorkbook.save();
      const workbook = transformUniverDataToWorkbook(univerData);
      
      const fileName = (univerData.name || 'export') + '.xlsx';
      writeFileXLSX(workbook, fileName);
    } catch (error) {
      console.error('Failed to export file:', error);
      alert('Failed to export file.');
    }
  };

  return (
    <button onClick={handleExport}>Export XLSX</button>
  );
};

export default ExportButton;
