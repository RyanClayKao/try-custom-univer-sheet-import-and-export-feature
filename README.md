# 嘗試客制出 Univer的Import與Export功能
## 使用技術
* React: 19+
* Univer Sheet: 免費版
* SheetJs: 免費版
## 痛點
因為 React開發上的需求，需要能夠做到像是Google Sheet、M365那樣線上使用 Excel(能夠CURD之外，還要能夠匯入與匯出)，可是多數的套件都是要收費的，而我又需要這樣的組件
## 行動
### 2026-01-08 23:24
- 我：問了問 Gemini我的需求怎麼解？
- Gemini：推薦Univer Sheet。
- 我：去官網逛逛，Demo看起來很棒，但是就是沒有匯入、匯出功能，要 Univer Pro才有這功能(果然沒那麼好的事 = =")。
- 我：再問問Gemini，有沒有其他輔助的套件能夠使用？
- Gemini：推薦可以使用 SheetJS，可以做到匯入、匯出
- 我：實際用 Vite建起這個專案，並且嘗試兩個套件都用用看。
  - 安裝兩個工具的相關套件
    - 發現 SheetJS的套件，官網說明的安裝方式有點奇怪，是透過特定網址取得「xlsx-0.20.3.tgz」的，以及建議是下載下來之後自行納入版控，專案的根路徑就建了 vendor資料夾，放進了那個套件檔，再按官方說明的方式安裝 ```npm i --save file:vendor:xlsx-0.20.3.tgz```
  - 簡易做了個上方導覽列，至少有個分頁可以切換
  - 安裝 React-Router，來處理路由
  - 做單欄式排版
  - 將兩個套件的範例程式碼都貼上來，嘗試跑起來
### (待續...)

## 開發流程 (Development Workflow)

本專案使用 **Spec-Kit** 進行規格驅動開發 (Spec-Driven Development)。

### 主要步驟：
1. **`/speckit.specify`**: 定義新功能規格，建立 `00x-feature-name` 分支。
2. **`/speckit.plan`**: 制定技術實作計畫。
3. **`/speckit.tasks`**: 將計畫拆解為可執行的任務。
4. **`/speckit.implement`**: 依序執行任務並完成開發。

### 規格文件管理：
- 所有規格與計畫檔案均存放於 `specs/` 目錄下。
- 分支合併至 `master` 後，對應的 `specs/00x-...` 目錄會被保留作為**歷史紀錄**。
- 新功能的編號會根據 `specs/` 中最高的序號自動遞增。