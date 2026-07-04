# 圖片壓縮與轉檔工具（Image Optimizer）

Node.js Side Project — 上傳一張圖片，壓縮或轉成 WebP，看到省下多少空間，並下載結果。

- 產品方向：**單頁即時式**— 上傳、設定、結果、錯誤都在同一頁完成，最少跳轉。
- 技術路線：Node.js / Express 後端 + 原生 HTML/CSS/JS 前台。

---

## 主流程

```
開啟前台頁面
  → 選擇圖片
  → 設定格式（預設 WebP）與品質（預設 80）
  → 送出
  → 後端驗證格式與大小
  → sharp 壓縮 / 轉檔
  → 回傳原始大小、處理後大小、節省比例、下載連結
  → 前台顯示結果，使用者下載
```

---

## 快速開始

```bash
npm install
cp .env.example .env
npm start
```

啟動後打開 `http://localhost:3000` 即為前台頁面。

驗證服務存活：

```bash
curl http://localhost:3000/health
```

---

## API

### `GET /health`

```json
{ "status": "ok", "service": "image-optimizer" }
```

### `POST /images/process`

`multipart/form-data`

| 欄位 | 類型 | 必填 | 說明 |
|---|---|---|---|
| `image` | file | 是 | 圖片檔（JPG / PNG / WebP，單檔 ≤ 5MB） |
| `format` | string | 否 | 預設 `webp` |
| `quality` | number | 否 | 1–100，預設 `80` |
| `maxWidth` | number | 否 | 超過才等比縮小 |

成功回應：

```json
{
  "filename": "output.webp",
  "originalSize": 1024000,
  "outputSize": 312000,
  "savedPercent": 69.5,
  "format": "webp",
  "previewUrl": "/downloads/output.webp",
  "downloadUrl": "/downloads/output.webp"
}
```

常見錯誤：

| 情境 | 狀態碼 | 訊息 |
|---|---:|---|
| 沒上傳圖片 | 400 | 請上傳圖片 |
| 格式不支援 | 400 | 只支援圖片檔案 |
| 檔案太大 | 413 | 圖片太大，請上傳較小的檔案 |
| `quality` 超出範圍 | 400 | 品質請輸入 1 到 100 |
| 處理失敗 | 500 | 圖片處理失敗，請稍後再試 |

---

## 資料夾結構

```
image-optimizer/
├── server.js                        # 進入點，啟動 Express
├── package.json
├── .env.example
├── .gitignore
├── README.md
│
├── src/
│   ├── app.js                       # Express app 組裝、掛 middleware/routes
│   │
│   ├── routes/                      # 【Louis｜API】
│   │   ├── health.route.js          #   GET /health
│   │   └── images.route.js          #   POST /images/process
│   │
│   ├── middlewares/                 # 【Gianni｜檔案驗證】
│   │   ├── upload.middleware.js     #   multer 設定（大小限制、暫存位置）
│   │   ├── validateImage.middleware.js  # 格式 / quality / maxWidth 驗證
│   │   └── errorHandler.middleware.js   # 統一錯誤回應格式
│   │
│   ├── services/                    # 【Ting｜圖片處理】
│   │   └── imageProcessor.service.js   # sharp：壓縮、resize、轉 WebP
│   │
│   └── utils/
│       ├── fileName.util.js         # 產生唯一檔名，避免覆蓋
│       └── formatBytes.util.js      # savedPercent / 大小格式化
│
├── public/                          # 【Becca｜前台畫面】方案 A 單頁
│   ├── index.html                   #   上傳／設定／結果／錯誤同頁
│   ├── styles.css
│   └── script.js                    #   fetch 呼叫 /images/process
│
├── uploads/                         # 上傳暫存（.gitignore）
├── downloads/                       # 處理後圖片（.gitignore）
│
└── docs/                            # 【A4｜README / Demo】
    ├── demo-script.md               #   3–5 分鐘 Demo 台詞
    ├── sample-images/                #   測試用範例圖片
    └── ai-collaboration.md          #   AI 協作紀錄
```

**分工對照**

| 角色 | 負責人 | 主要資料夾 |
|---|---|---|
| API / 路由 | Louis | `src/routes/` |
| 檔案驗證 | Gianni | `src/middlewares/` |
| 圖片處理 | Ting | `src/services/` |
| 前台畫面 | Becca | `public/` |
| README / Demo | A4 | `README.md`、`docs/` |

各自資料夾邊界清楚，減少多人同時改同一支檔案造成的 merge 衝突；共用的型別/格式（例如回應 JSON 欄位）以本 README 為準。

---

## 環境變數（`.env.example`）

```
PORT=3000
MAX_FILE_SIZE_MB=5
DEFAULT_QUALITY=80
DEFAULT_FORMAT=webp
```

---

## 驗收清單

- [ ] `npm install` / `npm start` 可跑起來
- [ ] `GET /health` 正常回應
- [ ] 前台可上傳、設定、送出、看到結果、下載
- [ ] 錯誤情境（未上傳／格式錯／檔案過大／quality 超範圍）皆有清楚訊息
- [ ] README 範例可直接照做測試

---

## AI 協作紀錄

> 詳見 `docs/ai-collaboration.md`

- 使用工具：Claude Design
- 加速的地方：快速產生初步討論的內容，README檔案
- 小組自己的判斷：（待補）
