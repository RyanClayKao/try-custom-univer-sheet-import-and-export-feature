import { useRef } from 'react';
import ExcelEditor from '../components/ExcelFeature/ExcelEditor';
import ImportButton from '../components/ExcelFeature/ImportButton';
import ExportButton from '../components/ExcelFeature/ExportButton';

const EditorPage = () => {
  const editorRef = useRef(null);

  const handleImport = (univerData) => {
    const univerAPI = editorRef.current?.getUniverAPI();
    if (univerAPI) {
      univerAPI.createWorkbook(univerData);
    }
  };

  const getUniverAPI = () => editorRef.current?.getUniverAPI();

  return (
    <div>
      <h1>Excel Import/Export Editor</h1>
      <ExcelEditor 
        ref={editorRef}
        toolbarContent={
          <>
            <ImportButton onImport={handleImport} />
            <ExportButton getUniverAPI={getUniverAPI} />
          </>
        }
      />
    </div>
  );
};

export default EditorPage;
