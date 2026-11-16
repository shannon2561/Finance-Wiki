## 一句話

特異性波動度是股票報酬中「市場與共同因子都解釋不了」的那部分波動，也就是只屬於這家公司的消息造成的波動。

## 定義

先用[[factor-models|因子模型]]對個股超額報酬做迴歸，例如 Fama-French 三因子：

$$R_{i,t} - R_{f,t} = \alpha_i + \beta_i\,MKT_t + s_i\,SMB_t + h_i\,HML_t + \varepsilon_{i,t}$$

**特異性波動度（IVOL）** 就是殘差 $\varepsilon_{i,t}$ 的標準差：

$$IVOL_i = \sqrt{\frac{1}{T-k-1}\sum_{t=1}^{T}\hat{\varepsilon}_{i,t}^{\,2}}$$

$T$ 是觀察期數，$k$ 是因子個數。常見做法是用過去一個月的日報酬估計，再視需要年化。

## 直覺理解

一檔股票的總波動可以拆成兩塊：

- **系統性波動**：跟著大盤、跟著小型股或價值股一起動的部分，可以用因子解釋
- **特異性波動**：財報意外、新產品、訴訟、管理層變動等只屬於這家公司的消息

古典理論認為，特異性風險可以靠分散投資消除，所以**不應該有溢酬**。但 Ang 等人（2006）發現相反的現象：IVOL 高的股票，未來平均報酬反而**更低**，這被稱為「特異性波動度之謎」。常見的解釋包括投資人偏好像彩券一樣的高波動股票，以及高 IVOL 股票難以套利。

## 常見誤解與限制

- **IVOL 的大小取決於用哪個因子模型**：換成五因子模型，殘差變小，IVOL 也跟著變。
- 估計期間太短（例如只有一個月）時，估計誤差很大，單一數字不能當成穩健結論。
- 「IVOL 低 = 安全」不一定成立：它只代表個股特有的波動小，市場風險仍然存在。
- IVOL 之謎在不同市場與期間的強度不一，可能受到小型股與流動性的影響。

## 延伸閱讀

- Ang, A., Hodrick, R. J., Xing, Y., & Zhang, X.（2006）。〈The Cross-Section of Volatility and Expected Returns〉。*Journal of Finance*, 61(1).
- Fama, E. F., & French, K. R.（1993）。〈Common Risk Factors in the Returns on Stocks and Bonds〉。*Journal of Financial Economics*, 33(1).
