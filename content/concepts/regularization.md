## 一句話

正則化是在模型的目標函數裡加一筆「複雜度罰金」，逼模型放棄小題大作的係數，換來更好的樣本外表現。

## 定義

以線性迴歸為例，在最小平方誤差後加入懲罰項：

$$\hat{\beta} = \arg\min_{\beta}\ \sum_{i=1}^{n}\left(y_i - x_i^\top\beta\right)^2 + \lambda\, P(\beta)$$

| 方法 | 懲罰項 $P(\beta)$ | 效果 |
|------|------------------|------|
| Ridge（L2） | $\sum_j \beta_j^2$ | 所有係數一起往 0 收縮，但不會剛好等於 0 |
| Lasso（L1） | $\sum_j \lvert\beta_j\rvert$ | 部分係數被壓成 0，有變數選擇效果 |
| Elastic Net | $\alpha\sum_j\lvert\beta_j\rvert + (1-\alpha)\sum_j\beta_j^2$ | 兩者折衷，適合一群高度相關的變數 |

$\lambda$ 控制懲罰強度：$\lambda=0$ 就是普通最小平方，$\lambda\to\infty$ 係數全部趨近 0。實務上用交叉驗證選 $\lambda$。

## 直覺理解

這是**偏誤與變異的取捨**。不加限制的模型會努力配適每一個資料點，包括雜訊，結果換一批資料就失準（變異大）。加上罰金後，模型被迫只保留真正有用的訊號，雖然在訓練資料上準度略降（偏誤增加），新資料上的表現反而更好。

為什麼 L1 會產生 0、L2 不會？把限制條件畫出來：L1 的可行區域是有尖角的菱形，誤差等高線常常先碰到尖角，也就是某個係數剛好為 0；L2 的可行區域是圓形，沒有尖角，所以只會縮小不會歸零。

## 常見誤解與限制

- **使用前一定要標準化特徵**，否則懲罰對不同尺度的變數不公平。
- Lasso 在一群高度相關的變數中會隨機挑一個，結果不穩定；財務特徵常有高度共線性，這時 Ridge 或 Elastic Net 通常比較穩。
- 正則化降低的是過度配適，不能修正資料本身的偏誤（例如前視偏誤）。
- 時間序列資料選 $\lambda$ 時，交叉驗證也要依時間切分。

## 延伸閱讀

- Hoerl, A. E., & Kennard, R. W.（1970）。〈Ridge Regression: Biased Estimation for Nonorthogonal Problems〉。*Technometrics*, 12(1).
- Tibshirani, R.（1996）。〈Regression Shrinkage and Selection via the Lasso〉。*Journal of the Royal Statistical Society: Series B*, 58(1).
- Zou, H., & Hastie, T.（2005）。〈Regularization and Variable Selection via the Elastic Net〉。*Journal of the Royal Statistical Society: Series B*, 67(2).
