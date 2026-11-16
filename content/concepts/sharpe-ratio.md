## 一句話

Sharpe Ratio 問的是：每多承擔一單位的波動，換到了多少超額報酬？

## 定義

$$SR = \frac{E[R_p] - R_f}{\sigma_p}$$

- $E[R_p]$：投資組合的期望報酬
- $R_f$：無風險利率
- $\sigma_p$：投資組合報酬的標準差

實務上用樣本平均與樣本標準差估計。**年化**時，若報酬序列彼此獨立，用月資料算出的 SR 要乘上 $\sqrt{12}$，日資料乘上約 $\sqrt{252}$。不同頻率、未年化的數字不能直接比較。

| 相關指標 | 分母 | 適合情境 |
|---------|------|---------|
| Sharpe Ratio | 總波動 $\sigma_p$ | 這筆錢是你的全部投資 |
| Sortino Ratio | 只算下檔波動 | 在意虧損多於在意上漲波動 |
| Information Ratio | 相對基準的追蹤誤差 | 評估主動經理人有沒有打敗大盤 |
| Treynor Ratio | 系統風險 $\beta$ | 這筆錢只是大組合中的一小部分 |

## 直覺理解

兩個策略都年賺 10%：一個每個月穩穩地漲，另一個上沖下洗、偶爾腰斬。大部分人會選前者，Sharpe Ratio 就是把這個直覺量化。

它還有一個好性質：**加槓桿不會改變 SR**。借錢把部位放大兩倍，超額報酬和波動都變兩倍，比值不變。所以 SR 衡量的是策略本身的「品質」，槓桿只是決定要用多大的量。這也是[[portfolio-optimization|投資組合最佳化]]中「最大 Sharpe 組合」的意義：先找品質最好的組合，再用無風險資產調整風險大小。

## 常見誤解與限制

- **只看波動，不管分配形狀**：賣出價外選擇權這類策略，平常穩定小賺、偶爾巨虧，SR 會很漂亮，卻藏著尾部風險。
- 報酬有自我相關時，用 $\sqrt{12}$ 年化會高估或低估。
- **回測的 SR 幾乎一定偏高**：試過越多組參數，最好的那一組越可能只是運氣，詳見 [[backtest-overfitting-and-validation]]。業界常見的經驗法則是把回測 SR 打折來估計實際表現。
- SR 本身有估計誤差，樣本期間短時，0.5 和 0.8 可能在統計上沒有差別。

## 延伸閱讀

- Sharpe, W. F.（1966）。〈Mutual Fund Performance〉。*Journal of Business*, 39(1).
- Sharpe, W. F.（1994）。〈The Sharpe Ratio〉。*Journal of Portfolio Management*, 21(1).
- Lo, A. W.（2002）。〈The Statistics of Sharpe Ratios〉。*Financial Analysts Journal*, 58(4).
