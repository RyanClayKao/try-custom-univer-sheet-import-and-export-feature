/* eslint-disable react-hooks/exhaustive-deps */
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
// import UniverPresetSheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'
import UniverPresetSheetsCoreZhTW from '@univerjs/preset-sheets-core/locales/zh-TW'
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets'
import { useEffect, useRef } from 'react'

import '@univerjs/preset-sheets-core/lib/index.css'
import classes from './Univer.module.css'

const Univer = () => {
  const containerRef = useRef(null)

  useEffect(() => {
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
    })

    univerAPI.createWorkbook({})

    return () => {
      univerAPI.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className={classes.univer} />
  )
};

export default Univer;