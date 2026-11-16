## 一句話

如果能隨時調整股票部位來完全抵銷選擇權的風險，那選擇權的價格就只能有一個，Black-Scholes 公式就是那個價格。

## 定義

假設股價服從幾何布朗運動、可連續交易、沒有交易成本與套利機會，歐式買權價格為：

$$C = S_0 N(d_1) - K e^{-rT} N(d_2)$$

$$d_1 = \frac{\ln(S_0/K) + (r + \sigma^2/2)T}{\sigma\sqrt{T}}, \qquad d_2 = d_1 - \sigma\sqrt{T}$$

- $S_0$：標的現價；$K$：履約價；$T$：到期時間（年）
- $r$：無風險利率；$\sigma$：標的報酬的年化波動度
- $N(\cdot)$：標準常態分配的累積機率函數

**Greeks** 衡量價格對各參數的敏感度，是避險的依據：Delta（$\partial C/\partial S$，買權為 $N(d_1)$）、Gamma（Delta 的變化率）、Vega（對波動度）、Theta（對時間）、Rho（對利率）。

## 直覺理解

這個模型最反直覺的地方是：**公式裡沒有股票的期望報酬 $\mu$**。

原因在於「避險組合」：持有一張買權，同時放空 $\Delta$ 股股票，在極短時間內股價的漲跌對兩邊的影響剛好抵銷，組合變成無風險。無風險的東西只能賺無風險利率，所以不管你多看好這檔股票，選擇權的價格都一樣。

這個想法叫做**風險中立定價**：可以假裝所有投資人都不在乎風險，用無風險利率折現期望報酬來算價格。在離散的二項式樹裡，風險中立機率是 $p = \frac{e^{r\Delta t}-d}{u-d}$；把時間切得無限細，二項式樹就收斂成 Black-Scholes。

同一套邏輯也能用在其他標的：把「持有收益率」$q$ 換成股息率（Merton 模型）、外幣利率（Garman-Kohlhagen 模型）或令 $q=r$（期貨選擇權的 Black 模型），公式結構完全相同。

## 常見誤解與限制

- **波動度不是常數**：實際市場中，不同履約價算出的隱含波動度不一樣，形成「波動度微笑」。
- 股價會跳動、報酬分配有肥尾，Black-Scholes 會低估深度價外選擇權的價值。
- 連續避險在現實中做不到，每次調整都有交易成本，所以 Delta 避險只能近似。
- 公式只適用歐式選擇權；美式選擇權需要二項式樹或數值方法。

## 延伸閱讀

- Black, F., & Scholes, M.（1973）。〈The Pricing of Options and Corporate Liabilities〉。*Journal of Political Economy*, 81(3).
- Merton, R. C.（1973）。〈Theory of Rational Option Pricing〉。*Bell Journal of Economics and Management Science*, 4(1).
- Cox, J. C., Ross, S. A., & Rubinstein, M.（1979）。〈Option Pricing: A Simplified Approach〉。*Journal of Financial Economics*, 7(3).
