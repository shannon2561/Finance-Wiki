# CLAUDE.md

這個專案的所有規則寫在 [AGENTS.md](AGENTS.md)。**開工前請先完整讀那一份**，這裡不重複。

給 Claude 的三個提醒（細節都在 AGENTS.md）：

1. 新增或修改內容只動 `content/concepts/` 和 `data/pages.json`；網頁外殼要改先問。
2. 第 6 節「公開與隱私規則」任何情況都不能違反；不確定就不要放，回報給使用者。
3. 完成前一定要跑 `python tools/check_site.py`，顯示 `ALL CHECKS PASSED` 才算完成。

如果 AGENTS.md 和這份有任何不一致，以 AGENTS.md 為準，並提醒使用者修正。
