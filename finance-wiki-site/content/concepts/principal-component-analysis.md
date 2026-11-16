## 一句話

PCA 把一大堆彼此相關的變數，濃縮成少數幾個互不相關、又保留最多資訊的新變數。

## 定義

給定已去平均的資料矩陣 $X$（$T$ 期 × $N$ 個變數），PCA 對共變異數矩陣做特徵值分解：

$$\Sigma = \frac{1}{T} X^\top X = V \Lambda V^\top$$

特徵向量 $v_1, v_2, \dots$ 是**主成分方向**，依特徵值 $\lambda_1 \ge \lambda_2 \ge \dots$ 排序；$\lambda_k / \sum_j \lambda_j$ 是第 $k$ 個主成分解釋的變異比例。

等價的說法是：PCA 找出能讓重建誤差最小的低秩近似，

$$\min_{F,\Lambda}\ \frac{1}{NT}\sum_{n,t}\left(X_{nt} - F_t \Lambda_n^\top\right)^2$$

在金融中，$X$ 常是多檔資產的報酬矩陣，主成分就是**統計因子**。

## 直覺理解

想像一團橢圓形的點雲。PCA 先找出點雲拉得最長的方向（第一主成分），再在和它垂直的方向中找次長的（第二主成分），依此類推。

把它用在一百檔股票的報酬上，第一主成分通常就是「整個市場一起漲跌」，第二、第三個可能對應產業或風格。原本一百個變數，用三、五個主成分就能描述大部分的共同波動。

**要決定留幾個主成分**，常見方法有：看累積解釋比例、交叉驗證、資訊準則（如 AIC），或專為因子模型設計的 Onatski 準則。

## 常見誤解與限制

- **解釋最多變異 ≠ 最有用**：PCA 只看共變異，不保證萃取出的因子能解釋期望報酬，常常抓到統計雜訊。這是 [[risk-premium-pca|RP-PCA]] 想解決的問題。
- PCA 對變數的尺度很敏感，使用前通常要標準化。
- 主成分是線性組合，很難直接說出經濟意義。
- 只捕捉線性關係。

| 延伸方法 | 和 PCA 的差別 |
|---------|--------------|
| PCR（主成分迴歸） | 先 PCA 降維，再對目標做迴歸 |
| PLS（偏最小平方） | 降維時同時考慮和目標變數 $y$ 的關係 |
| RP-PCA | 目標函數加入橫截面定價誤差 |

## 延伸閱讀

- Jolliffe, I. T.（2002）。《Principal Component Analysis》（第 2 版）。Springer.
- Onatski, A.（2010）。〈Determining the Number of Factors from Empirical Distribution of Eigenvalues〉。*Review of Economics and Statistics*, 92(4).
