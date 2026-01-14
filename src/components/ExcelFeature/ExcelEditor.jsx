import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import UniverPresetSheetsCoreZhTW from '@univerjs/preset-sheets-core/locales/zh-TW';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

import '@univerjs/preset-sheets-core/lib/index.css';
import styles from './ExcelEditor.module.css';

const ExcelEditor = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const [univerInstance, setUniverInstance] = useState(null);

  useImperativeHandle(ref, () => ({
    getUniverAPI: () => univerInstance
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const { univerAPI } = createUniver({
      locale: LocaleType.ZH_TW,
      locales: {
        [LocaleType.ZH_TW]: mergeLocales(
          UniverPresetSheetsCoreZhTW,
        ),
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
    });

    setUniverInstance(univerAPI);

    // Initial empty workbook
    univerAPI.createWorkbook({});

    return () => {
      univerAPI.dispose();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        {props.toolbarContent}
      </div>
      <div ref={containerRef} className={styles.editorHost} />
    </div>
  );
});

ExcelEditor.displayName = 'ExcelEditor';

export default ExcelEditor;
