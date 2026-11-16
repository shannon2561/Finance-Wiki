## 一句話

因子模型用少數幾個「共同風險來源」來解釋為什麼不同股票的平均報酬不一樣。

## 定義

一般形式是把資產 $i$ 的超額報酬拆成共同因子與個別部分：

$$R_{i,t} - R_{f,t} = \alpha_i + \sum_{k=1}^{K} \beta_{i,k} F_{k,t} + \varepsilon_{i,t}$$

$F_{k,t}$ 是第 $k$ 個因子的報酬，$\beta_{i,k}$ 是資產對該因子的曝險。如果模型正確，$\alpha_i$ 應該為零：期望報酬的差異全部來自因子曝險。

| 模型 | 因子 | 想法 |
|------|------|------|
| CAPM | 市場超額報酬 | 只有系統風險會被補償 |
| Fama-French 三因子（1993） | 市場、規模（SMB）、價值（HML） | 小型股與價值股有額外溢酬 |
| Fama-French 五因子（2015） | 再加獲利能力（RMW）、投資（CMA） | 用公司基本面解釋更多異常 |
| q-factor（Hou, Xue & Zhang） | 市場、規模、投資、獲利 | 從公司投資決策出發 |
| 統計因子 | 由資料萃取 | 見 [[principal-component-analysis|PCA]]、[[risk-premium-pca|RP-PCA]] |

## 直覺理解

想像一班同學的考試成績。大部分差異可以用幾個共同原因解釋：念書時數、考前有沒有睡飽、這次考題偏哪一章。因子模型做的是同一件事：股票報酬的差異，大多可以用「整體市場漲跌」「公司大小」「便宜或昂貴」這類共同因素說明，剩下的才是個股自己的故事。

因子的**曝險**（$\beta$）就像每個同學對那個原因的敏感度：有人很吃睡眠，有人無所謂。

## 常見誤解與限制

- **因子動物園（factor zoo）**：學術界已經發表了數百個「顯著」因子，很多是資料探勘的結果，換個期間或市場就消失。這也是 [[machine-learning-asset-pricing|ML 資產定價]]和統計因子方法興起的背景。
- $\alpha$ 不為零不一定代表賺錢機會，也可能是模型漏掉某個風險因子。
- 因子溢酬會隨時間變化，過去顯著不保證未來存在。
- 套用到台灣市場時，因子表現可能和美股不同，例如研究期間成長股不一定輸給價值股。

## 延伸閱讀

- Fama, E. F., & French, K. R.（1993）。〈Common Risk Factors in the Returns on Stocks and Bonds〉。*Journal of Financial Economics*, 33(1).
- Fama, E. F., & French, K. R.（2015）。〈A Five-Factor Asset Pricing Model〉。*Journal of Financial Economics*, 116(1).
- Harvey, C. R., Liu, Y., & Zhu, H.（2016）。〈…and the Cross-Section of Expected Returns〉。*Review of Financial Studies*, 29(1).
