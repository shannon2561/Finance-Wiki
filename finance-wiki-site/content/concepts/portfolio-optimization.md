## 一句話

投資組合最佳化是在「想要的報酬」和「能忍受的風險」之間，用數學算出每項資產該放多少錢。

## 定義

Markowitz（1952）的均值－變異數框架：給定 $N$ 項資產的期望報酬向量 $\mu$ 與共變異數矩陣 $\Sigma$，選擇權重 $w$：

$$\max_{w}\ w^\top\mu - \frac{\lambda}{2}\, w^\top \Sigma\, w \qquad \text{s.t.}\ \ \mathbf{1}^\top w = 1$$

$\lambda$ 是風險趨避係數。改變 $\lambda$ 會得到一整條**效率前緣**；加入無風險資產後，最佳風險組合是使 [[sharpe-ratio|Sharpe Ratio]] 最大的切點組合。

| 方法 | 目標 | 主要弱點 |
|------|------|---------|
| 均值－變異數 | 報酬與風險取捨 | 期望報酬估計差一點，權重就大幅改變 |
| 全域最小變異數 | 風險最低 | 不使用報酬資訊 |
| 最大 Sharpe | 每單位風險報酬最高 | 同樣依賴 $\mu$ |
| 等權重（1/N） | 平均分散 | 忽略所有資訊，卻常常很難打敗 |
| 風險平價 | 每項資產的風險貢獻相等 | 不考慮報酬預測 |

## 直覺理解

分散的價值來自**相關性**：兩項資產若不完全同步，放在一起的波動會小於各自波動的加權平均。最佳化是用數學把這件事算出來：在同樣的期望報酬下，找出波動最低的權重。

問題是，最佳化器會「放大估計誤差」。如果某項資產的期望報酬被高估了一點，它就會被分到很大的權重，甚至搭配極端的放空。所以實務上，**限制條件反而有幫助**：Jagannathan & Ma（2003）發現，禁止放空這種看似「錯誤」的限制，會把極端權重壓回來，效果類似[[regularization|正則化]]。

## 常見誤解與限制

- **樣本內最佳 ≠ 樣本外最佳**：以最大 Sharpe 為目標算出的組合，樣本外常常輸給最小變異數組合，因為後者不依賴雜訊很大的期望報酬估計。
- 共變異數矩陣在資產數量多、樣本期間短時會很不穩定，常需要收縮估計或[[factor-models|因子模型]]結構。
- 均值－變異數只看前兩階動差，忽略偏態與肥尾。
- 沒考慮交易成本時，最佳權重可能每期大幅變動。

## 延伸閱讀

- Markowitz, H.（1952）。〈Portfolio Selection〉。*Journal of Finance*, 7(1).
- Jagannathan, R., & Ma, T.（2003）。〈Risk Reduction in Large Portfolios: Why Imposing the Wrong Constraints Helps〉。*Journal of Finance*, 58(4).
- DeMiguel, V., Garlappi, L., & Uppal, R.（2009）。〈Optimal Versus Naive Diversification: How Inefficient Is the 1/N Portfolio Strategy?〉。*Review of Financial Studies*, 22(5).
