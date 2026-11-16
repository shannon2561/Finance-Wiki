# Finance Wiki｜金融學習筆記

把一份私人 LLM Wiki 裡可以公開的金融概念，整理成網站。每頁一個概念（Black-Scholes、Sharpe Ratio、RP-PCA 等），固定用「一句話 → 定義 → 直覺理解 → 常見誤解與限制 → 延伸閱讀」五個區塊呈現。

- 網站：`https://<你的帳號>.github.io/<repo 名稱>/`
- 給 AI 的工作手冊：[`AGENTS.md`](AGENTS.md)（`CLAUDE.md` 指向它）

## 這個專案的重點

網頁只寫一次，之後的內容由 AI 依照 `AGENTS.md` 的規則持續新增。新增一個概念只需要：

1. 在 `content/concepts/` 新增一個 Markdown 檔（照 `templates/concept-template.md`）
2. 在 `data/pages.json` 加一筆 metadata
3. 執行 `python tools/check_site.py` 確認全部通過

實際對 AI 下的指令只要一句：

```
請先讀 AGENTS.md，然後把 wiki 的 <slug> 上架成概念頁。
```

## 結構

```
index.html / concept.html / about.html   網頁外殼（固定）
content/concepts/*.md                    概念頁內文
data/pages.json                          概念索引與 metadata
data/categories.json                     六個主題分類
templates/concept-template.md            新頁面模板
tools/check_site.py                      一致性與隱私檢查
assets/                                  樣式、程式與第三方函式庫（marked、KaTeX）
```

## 本機預覽

```
python -m http.server 8000
```

打開 http://localhost:8000 。直接雙擊 HTML 檔會因瀏覽器安全限制讀不到資料。

## 授權

內容為個人學習筆記。`assets/vendor/` 內的 marked（MIT）與 KaTeX（MIT）保留各自授權。
