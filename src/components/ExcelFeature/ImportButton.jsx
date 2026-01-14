import { useRef } from 'react';
import { parseFileToWorkbook, transformWorkbookToUniverData } from '../../services/excelParser';

const ImportButton = ({ onImport }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const workbook = await parseFileToWorkbook(file);
      const univerData = transformWorkbookToUniverData(workbook);
      onImport(univerData);
    } catch (error) {
      console.error('Failed to import file:', error);
      alert('Failed to import file. Please make sure it is a valid .xlsx file.');
    } finally {
      // Clear input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx"
        style={{ display: 'none' }}
      />
      <button onClick={handleButtonClick}>Import XLSX</button>
    </>
  );
};

export default ImportButton;
