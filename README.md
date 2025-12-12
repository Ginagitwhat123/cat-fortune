# 抽一籤好喵

一個每日抽運勢籤搭配貓咪圖片隨機生成的 side project。

## 技術棧

- React (Vite)
- TypeScript
- TailwindCSS

## 功能特色

- 🐱 每日隨機貓咪圖片
- ⭐ 運勢評分（1-5 顆星）
- 📝 與貓有關的運勢小語
- 💾 使用 localStorage 記錄每日抽籤結果
- 🔒 一天只能抽一次籤

## 安裝與執行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置
npm run build

# 預覽建置結果
npm run preview
```

## 使用說明

1. 點擊「抽一籤」按鈕
2. 系統會隨機選擇一張貓咪圖片和運勢小語
3. 結果會顯示在彈跳視窗中
4. 抽籤結果會儲存在 localStorage，一天只能抽一次
5. 如果已經抽過，可以點擊「查看已抽的籤」來查看今日的結果

