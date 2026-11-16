## 一句話

RP-PCA 在傳統 PCA 上多加一個條件：找出來的因子不只要解釋報酬怎麼一起波動，還要能解釋為什麼平均報酬不一樣。

## 定義

由 Lettau & Pelger（2020）提出。目標函數在 [[principal-component-analysis|PCA]] 的時序配適誤差之外，加上以 $\gamma$ 加權的**橫截面定價誤差**：

$$\min_{F,\Lambda}\ \frac{1}{NT}\sum_{n,t}\left(X_{nt} - F_t\Lambda_n^\top\right)^2 + \gamma\,\frac{1}{N}\sum_{n}\left(\bar{X}_n - \bar{F}\Lambda_n^\top\right)^2$$

- 第一項：因子能不能還原每期的報酬（和 PCA 相同）
- 第二項：因子能不能解釋每檔資產的**平均**報酬 $\bar{X}_n$

這等價於對下面這個矩陣做 PCA：

$$\Sigma_{RP} = \frac{1}{T}X^\top X + \gamma\,\bar{X}\bar{X}^\top$$

| $\gamma$ | 行為 |
|---|------|
| $-1$ | 等同傳統 PCA（只看共變異） |
| $> 0$ | 越大越重視平均報酬的定價能力 |

## 直覺理解

傳統 PCA 會優先抓「大家一起動得很厲害」的方向，但一起動不代表有報酬。一個產業因子可能讓股票同漲同跌，卻沒有長期溢酬；有些因子波動不大，卻穩定帶來超額報酬。

RP-PCA 在 $\Sigma_{RP}$ 裡加入 $\bar{X}\bar{X}^\top$，等於告訴演算法：「平均報酬的差異也很重要，請朝那個方向多看一點。」結果是萃取出的因子更像真正被市場補償的**風險溢酬**。

## 常見誤解與限制

- $\gamma$ 是超參數，太大會過度配適樣本內的平均報酬，需要用樣本外績效選擇。
- 和 PCA 一樣，因子是線性組合，經濟意義要事後用已知因子（市場、規模、動能等）迴歸來解讀。
- 平均報酬的估計本身雜訊很大，樣本期間太短時第二項可能放大誤差。

## 延伸閱讀

- Lettau, M., & Pelger, M.（2020）。〈Factors That Fit the Time Series and Cross-Section of Stock Returns〉。*Review of Financial Studies*, 33(5).
- Lettau, M., & Pelger, M.（2020）。〈Estimating Latent Asset-Pricing Factors〉。*Journal of Econometrics*, 218(1).
