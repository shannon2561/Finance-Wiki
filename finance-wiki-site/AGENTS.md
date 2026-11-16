# AGENTS.md — Finance Wiki 網站的工作手冊

> 給所有 AI agent（Claude Code、Codex、Gemini、Antigravity…）讀的入口。
> **每次開工前先讀完這份**，再動任何檔案。`CLAUDE.md` 只是指回這裡。
> 規則有衝突時，以這份為準；發現規則不夠用時，先提出修改建議，等使用者同意再改。

---

## 1. 這個專案在做什麼

把我（使用者）在財務金融學習過程中累積的**私人 LLM Wiki**，轉成一個**公開的金融概念網站**。

- 讀者：想快速搞懂某個金融／量化概念的同學，以及未來的我自己。
- 一頁 = 一個概念（例如 Black-Scholes、Sharpe Ratio、RP-PCA）。
- 網站要能**一直長大**：每讀完一份講義或論文，就能照同一套規則新增概念頁，而不用重新設計網站。

### 三層分工

```
../wiki/  (私人原始資料，不在這個 repo 裡)
   │   使用者的 LLM Wiki：concepts / sources / projects / people / raw
   │   ── 只讀，永遠不修改，也永遠不上傳 ──
   ▼
AGENTS.md  (規則層，這份檔案)
   │   決定「什麼能公開、怎麼改寫、放在哪裡、長什麼樣」
   ▼
finance-wiki-site/  (公開網站，就是這個 repo)
   content/concepts/*.md  ← AI 依模板改寫的「公開版」概念頁
   data/pages.json        ← 所有頁面的索引（網站從這裡讀資料）
   index.html / concept.html / about.html  ← 固定的網頁外殼
```

**你的工作幾乎都在 `content/` 和 `data/`。** 網頁外殼（HTML/CSS/JS）已經做好，新增內容時不需要、也不應該去改。

---

## 2. 檔案結構（每個檔案的職責）

```
finance-wiki-site/
├── AGENTS.md                  ← 本檔：規則（你正在讀）
├── CLAUDE.md                  ← 指路檔：叫 Claude 讀 AGENTS.md
├── README.md                  ← 給人類看的專案說明
├── index.html                 ← 首頁：搜尋、分類篩選、概念卡片、學習地圖
├── concept.html               ← 概念頁外殼：用 #<slug> 載入 content/concepts/<slug>.md
├── about.html                 ← 說明網站怎麼運作、怎麼用 AI 擴充
├── .nojekyll                  ← 讓 GitHub Pages 原樣提供檔案（不要刪）
├── content/
│   └── concepts/<slug>.md     ← 概念頁內文（只有內文，沒有 metadata）
├── data/
│   ├── pages.json             ← 概念頁索引與 metadata（唯一的 metadata 來源）
│   └── categories.json        ← 分類清單（固定，改動要經使用者同意）
├── templates/
│   └── concept-template.md    ← 新概念頁的空白模板
├── assets/
│   ├── css/style.css          ← 全站樣式（設計 token 都在 :root）
│   ├── js/site.js             ← 全站邏輯（讀 JSON、渲染 Markdown 與數學式）
│   └── vendor/                ← 第三方函式庫（marked、KaTeX），不要修改
└── tools/
    └── check_site.py          ← 一致性檢查，每次改完都要跑
```

**不可修改**：`assets/vendor/`、`.nojekyll`。
**改之前要先問使用者**：`index.html`、`concept.html`、`about.html`、`assets/`、`data/categories.json`、本檔。
**可以直接新增／修改**：`content/concepts/*.md`、`data/pages.json`。

---

## 3. 網站風格

整體感覺：**安靜的研究筆記本**——米白紙張底色、深墨藍文字、抹茶綠點綴，像一本整理得很乾淨的讀書筆記，而不是花俏的行銷網站。

| Token（定義在 `assets/css/style.css` 的 `:root`） | 值 | 用途 |
|---|---|---|
| `--paper` | `#F7F5EF` | 頁面底色 |
| `--card` | `#FFFFFF` | 卡片、內文區塊 |
| `--ink` | `#1F2A37` | 主要文字 |
| `--muted` | `#5B6472` | 次要文字、說明 |
| `--accent` | `#4F7A5A` | 抹茶綠：連結、重點、按鈕 |
| `--gold` | `#B08D57` | 少量點綴（等級標籤、引用線） |
| `--line` | `#E4E0D6` | 邊框、分隔線 |

- 標題用襯線字（Noto Serif TC），內文用無襯線字（系統字／Noto Sans TC）。
- 每個分類有自己的顏色，定義在 `data/categories.json`，卡片與標籤會自動套用。**不要在內文裡自己寫顏色或 HTML 樣式。**
- 內文只用 Markdown：標題、段落、清單、表格、引用、行內程式碼、數學式。不要寫 `<div>`、`<style>`、`<script>`。
- 數學式用 KaTeX 語法：行內 `$...$`，獨立一行 `$$...$$`。

---

## 4. 分類（固定六類）

| id | 名稱 | 收什麼 |
|---|---|---|
| `derivatives` | 衍生性商品 | 選擇權、期貨、定價模型、Greeks、避險 |
| `asset-pricing` | 資產定價與因子 | 因子模型、異常報酬、統計因子、ML 資產定價 |
| `portfolio` | 投資組合與績效 | 資產配置、最佳化、績效指標、部位大小 |
| `ml` | 機器學習方法 | 跨領域的統計／ML 方法本身（PCA、正則化、樹模型…） |
| `quant-practice` | 量化策略實務 | 回測、驗證、交易成本、策略開發流程 |
| `llm` | AI 與 LLM 系統 | RAG、Agent、Prompt 安全等 LLM 工程主題 |

判斷原則：**依「這個概念主要用來解決什麼問題」分類**，不是依「在哪堂課學到」。例如 PCA 歸 `ml`（它是方法），RP-PCA 歸 `asset-pricing`（它是為定價設計的）。一個概念只能有一個分類；跨領域的關係用 `related` 表達。

新增分類前一定要先問使用者。

---

## 5. 概念頁的格式

### 5.1 `data/pages.json` 的一筆資料

```json
{
  "slug": "black-scholes-model",
  "title": "Black-Scholes 模型",
  "title_en": "Black-Scholes Model",
  "category": "derivatives",
  "level": "進階",
  "summary": "用無套利與連續避險推導出的歐式選擇權封閉解，以及背後的風險中立定價原理。",
  "tags": ["選擇權", "風險中立", "Greeks"],
  "related": ["derivatives", "sharpe-ratio"],
  "updated": "2026-11-16",
  "status": "published"
}
```

| 欄位 | 規則 |
|---|---|
| `slug` | 英文 kebab-case，等於檔名（不含 `.md`）。**沿用私人 wiki 的 concept 檔名**，方便日後對照。 |
| `title` | 中文為主的頁面名稱，可含英文縮寫（如「RP-PCA（風險溢酬主成分分析）」）。 |
| `title_en` | 英文正式名稱。 |
| `category` | 必須是第 4 節六個 id 之一。 |
| `level` | `基礎`／`中階`／`進階` 三選一。基礎＝大學部必修就會碰到；進階＝需要研究所程度的數學或文獻。 |
| `summary` | 一句話、40–70 字，會顯示在卡片上。說「它是什麼／解決什麼」，不要寫「本頁介紹…」。 |
| `tags` | 2–4 個中文關鍵字，用於搜尋。 |
| `related` | 1–5 個**已存在於 pages.json** 的 slug。關係要雙向：A 列了 B，B 也要列 A。 |
| `updated` | 最後修改日期 `YYYY-MM-DD`。 |
| `status` | `published`（顯示）或 `draft`（不顯示，用來先占位）。 |

`pages.json` 依分類分組、同分類內依「先基礎後進階」排序，這個順序就是首頁學習地圖的順序。

### 5.2 `content/concepts/<slug>.md` 的內文

只寫內文，**不要**放 YAML frontmatter（metadata 只有 `pages.json` 一個來源，避免兩邊不一致）。
第一行不要寫 `# 標題`——標題由網頁外殼從 `pages.json` 自動產生。

固定五個區塊，**標題文字與順序都不能改**（網站會依標題套用樣式）：

```markdown
## 一句話
（用一句白話說出核心，讓完全沒學過的人也能抓到重點。可以和 summary 不同、更口語。）

## 定義
（正式定義。需要公式就放在這裡，用 $$...$$。每個符號都要解釋。）

## 直覺理解
（用例子、比喻或「為什麼會這樣」來解釋。這是這個網站最重要的區塊。）

## 常見誤解與限制
（2–4 點條列：常見的錯誤理解、模型假設、實務上會失效的地方。）

## 延伸閱讀
（條列公開文獻，格式：作者（年份）。〈標題〉。期刊或出處。）
```

- 篇幅：每頁 400–1000 字為宜，寧可清楚也不要堆資訊。
- 區塊內可以用 `###` 小標、表格、清單。
- 連到其他概念頁用 `[[slug]]` 或 `[[slug|顯示文字]]`，網站會自動轉成連結；連到不存在的 slug 會被檢查腳本抓出來。
- 數字一律要能對回公開出處（論文、教科書），並在同一句寫出出處。
- 內文只講概念本身，不寫個人經歷：不提修過哪門課、做過哪個專案、在哪裡學到。私人 wiki 裡的課程與專案紀錄只拿來理解脈絡。

---

## 6. 公開與隱私規則（最重要，任何情況都不能違反）

這個 repo 是 Public，全世界都看得到。私人 wiki 裡混有不能公開的東西，改寫時必須過濾。

### 永遠不能出現在網站上

1. **私人 wiki 本身**：`../wiki/` 任何檔案都不能複製進 repo，`raw/`（含論文全文、講義原檔）尤其不行——有版權問題。
2. **真實人物的私人資訊**：同學、社員、講者、教授的姓名與評論。可以寫的只有**已發表論文的作者**（以引用格式出現）。
3. **升學、成績、個人規劃**：推甄、讀書計畫、成績單、申請資料、任何「我打算⋯⋯」。
4. **社團與組織的內部資訊**：社課講者姓名、內部會議內容、內部績效或策略細節。可以寫成「量化交易社團社課」這種泛稱，只引用其中的**通用觀念**。
5. **個人經歷**：修過的課、做過的專案與其數字結果（回測績效、Sharpe、報酬率等）、「我」的學習歷程。
6. **本機路徑與帳號資訊**：`C:\Users\...`、檔名路徑、API key、email。

### 改寫流程中的判斷

- 不確定能不能公開 → **不要放**，在回報中列出來問使用者。
- 私人 wiki 的內容是「素材」，不是「原文」：用自己的話重寫成固定五區塊，不要整段複製。
- 私人 wiki 裡標註「未確認」「推估」的資訊，不寫進網站。

---

## 7. 標準作業流程

### 7.1 新增一個概念頁（最常用）

使用者會說類似：「把 wiki 的 `<slug>` 上架」、「新增一頁講 Greeks」、「這份講義整理成概念頁」。

1. **確認不重複**：查 `data/pages.json`，已存在就改走 7.2。
2. **讀素材**：
   - 上架既有概念 → 讀 `../wiki/concepts/<slug>.md`，以及它連到的 `sources/`、`projects/` 頁（只為了理解脈絡）。
   - 全新主題 → 讀使用者給的資料；需要私人 wiki 也有一頁的話，提醒使用者先在 wiki 端 ingest。
3. **決定 metadata**：分類（第 4 節）、等級、2–4 個 tags、1–5 個 related（只能選已存在的頁面）。
4. **寫內文**：複製 `templates/concept-template.md` 成 `content/concepts/<slug>.md`，依第 5.2 節五區塊填寫，並逐條對照第 6 節過濾。
5. **更新索引**：在 `data/pages.json` 對應分類的位置加入一筆；**同時**把這個新 slug 加進每一個 related 頁面的 `related`（維持雙向）。
6. **檢查**：執行 `python tools/check_site.py`，全部通過才算完成。
7. **本機預覽**：`python -m http.server 8000`，打開 `http://localhost:8000/concept.html#<slug>` 確認數學式、表格、連結都正常（直接雙擊 html 檔會因瀏覽器安全限制讀不到 JSON）。
8. **回報**：列出新增／修改的檔案、選了哪個分類與理由、有哪些內容因隱私規則被拿掉。

### 7.2 修改既有頁面

只改需要改的區塊，保持五區塊結構；把 `pages.json` 裡該頁的 `updated` 改成今天；跑 `tools/check_site.py`。

### 7.3 下架頁面

把 `status` 改成 `draft`（不要直接刪檔），並從其他頁面的 `related` 移除它；跑檢查。

### 7.4 改網站外觀或功能

先說明要改什麼、為什麼、影響哪些檔案，**等使用者同意**再動。改完要確認首頁、任一概念頁、about 頁三種頁面都正常。

---

## 8. 完成的定義（Definition of Done）

一次任務要同時滿足以下全部，才能回報「完成」：

- [ ] `python tools/check_site.py` 顯示 `ALL CHECKS PASSED`
- [ ] 新頁面五個區塊齊全、順序正確
- [ ] `related` 雙向一致，且沒有連到不存在的頁面
- [ ] 逐條對照第 6 節，沒有任何不可公開的內容
- [ ] 本機預覽過，數學式與表格正確顯示
- [ ] 回報中列出改了哪些檔案

---

## 9. 發佈

網站用 GitHub Pages 從 `main` 分支根目錄發佈。上傳時上傳的是**這個資料夾裡面的檔案**，不是資料夾本身；`index.html` 必須在 repo 最外層。push 或上傳後約 1–3 分鐘網站更新。
