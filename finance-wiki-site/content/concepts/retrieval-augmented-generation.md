## 一句話

RAG 讓語言模型先去「翻書」找相關段落，再根據找到的內容回答，而不是只靠記憶硬掰。

## 定義

**檢索增強生成（Retrieval-Augmented Generation）**：收到問題後，先從外部文件庫檢索最相關的段落，把它們連同問題一起放進提示詞，再交給 LLM 生成答案。

一個基本的 RAG 系統包含：

| 元件 | 做什麼 | 常見選擇 |
|------|-------|---------|
| 切分（chunking） | 把長文件切成段落 | 段落大小與重疊長度的取捨 |
| 嵌入（embedding） | 把段落轉成向量 | 多語言嵌入模型 |
| 檢索器 | 找出最相關的段落 | BM25（詞頻）、向量相似度、混合 |
| 排序融合 | 合併多路檢索結果 | RRF（倒數排名融合） |
| 生成 | 根據段落回答並附出處 | 提示詞要求「只根據資料回答」 |

RRF 的分數是 $\text{score}(d) = \sum_{r} \frac{1}{k + \text{rank}_r(d)}$，對每個檢索器給的名次取倒數加總，$k$ 常設為 60。

## 直覺理解

LLM 像一個讀過很多書、但沒辦法查資料的學生，考試時遇到沒讀過的內容就容易亂猜（幻覺）。RAG 等於讓他開書考：先翻到相關頁，再照著寫。

**BM25 和向量檢索各有強項**：BM25 擅長抓精確的關鍵字（人名、專有名詞），向量檢索擅長抓意思相近但用字不同的句子。中文還要先斷詞，BM25 才有詞可比。把兩路結果用 RRF 融合，通常比單用一種更穩。

## 常見誤解與限制

- **檢索錯了，生成就跟著錯**：RAG 的品質上限是檢索品質，答不好時要先檢查找到的段落對不對。
- 切太小會失去上下文，切太大會塞進太多無關內容，沒有通用最佳值。
- 檢索進來的文件可能夾帶惡意指令（提示注入），系統要把文件內容當資料、不當指令。
- 評估要分開看「檢索準不準」和「回答忠不忠於來源」。

## 延伸閱讀

- Lewis, P., et al.（2020）。〈Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks〉。*NeurIPS 2020*.
- Robertson, S., & Zaragoza, H.（2009）。〈The Probabilistic Relevance Framework: BM25 and Beyond〉。*Foundations and Trends in Information Retrieval*, 3(4).
- Cormack, G. V., Clarke, C. L. A., & Büttcher, S.（2009）。〈Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods〉。*SIGIR 2009*.
