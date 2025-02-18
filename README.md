# Web Note

一個現代化的網頁筆記 app，使用 SvelteKit 和 MongoDB 構建。支持 Google 帳號登入，讓你可以隨時隨地管理你的筆記。

## 功能特點

- 🔐 Google OAuth 登入
- 📝 創建和管理筆記
- 🏷️ 標籤管理
- 🔍 全文搜索
- 🌐 網站關聯
- 🎨 自定義筆記顏色
- 📱 響應式設計
- ⚡ 快速加載和平滑過渡

## 截圖

### Dashboard
*筆記儀表板視圖，展示了筆記卡片的網格布局和搜索功能*

### 筆記編輯
*筆記編輯界面，支持標題、內容、標籤和顏色設置*

### Mobile View
*響應式設計，在移動設備上提供最佳體驗*

## 技術棧

- **前端框架**: SvelteKit
- **數據庫**: MongoDB
- **認證**: Google OAuth (@auth/sveltekit)
- **樣式**: Tailwind CSS
- **ORM**: Prisma
- **開發工具**: TypeScript, Vite

## 開始使用

1. clone repo：
```bash
git clone <repository-url>
cd web-note
```

2. 安裝 dependencies：
```bash
npm install
```

3. 設置環境變量：
創建 `.env` 文件並添加以下配置：
```env
DATABASE_URL="your-mongodb-url"
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
AUTH_SECRET="your-auth-secret"
```

4. 初始化數據庫：
```bash
npx prisma generate
npx prisma db push
```

5. （可選）添加測試數據：
```bash
npx prisma db seed
```

6. 運行開發服務器：
```bash
npm run dev
```

## 項目結構

```
web-note/
├── src/
│   ├── lib/
│   │   ├── components/    # 可重用組件
│   │   ├── stores/        # Svelte stores
│   │   ├── apis/          # API 客戶端函數
│   │   └── types/         # TypeScript 類型定義
│   └── routes/            # SvelteKit 路由
├── prisma/
│   ├── schema.prisma      # 數據庫 schema
│   └── seed.mts           # 測試數據腳本
└── static/                # 靜態資源
```

## 數據模型

### Note
- `id`: 唯一標識符
- `title`: 筆記標題
- `content`: 筆記內容
- `tags`: 標籤列表
- `website`: 關聯的網站 URL
- `color`: 筆記顏色
- `position`: 筆記位置
- `size`: 筆記大小
- `userId`: Google 用戶 ID
- `userEmail`: 用戶郵箱
- `createdAt`: 創建時間
- `updatedAt`: 更新時間

## 開發

### 添加新功能

1. 創建新的組件：
```bash
touch src/lib/components/YourComponent.svelte
```

2. 添加新的 API 端點：
在 `src/routes/api/` 下創建新的端點。

3. 更新數據庫 schema：
修改 `prisma/schema.prisma` 並運行：
```bash
npx prisma generate
npx prisma db push
```

### 代碼風格

- 使用 TypeScript 進行類型檢查
- 遵循組件化開發原則
- 使用 Svelte stores 管理狀態
- 實現響應式設計

## 貢獻

歡迎提交 Pull Requests 和 Issues！

## 授權

MIT License
