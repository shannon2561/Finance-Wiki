"""Finance Wiki 一致性與隱私檢查。

用法（在 repo 根目錄）：
    python tools/check_site.py

檢查項目對應 AGENTS.md：
  1. data/pages.json 欄位格式（第 5.1 節）
  2. pages.json 與 content/concepts/ 一一對應
  3. 概念頁五區塊結構、禁用 HTML、[[連結]] 有效（第 5.2 節）
  4. related 存在且雙向（第 5.1 節）
  5. 隱私掃描（第 6 節）
  6. 網站必要檔案存在
有 ERROR 時以非零狀態結束；WARNING 不影響通過，但要在回報中說明。
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "concepts"
PRIVATE_WIKI = ROOT.parent / "wiki"  # 私人 wiki（不在 repo 內，存在時才做人名比對）

REQUIRED = ["slug", "title", "title_en", "category", "level", "summary",
            "tags", "related", "updated", "status"]
LEVELS = {"基礎", "中階", "進階"}
STATUSES = {"published", "draft"}
SECTIONS = ["一句話", "定義", "直覺理解", "常見誤解與限制", "延伸閱讀"]
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]")
HTML_RE = re.compile(r"<\s*(div|span|style|script|iframe|img|font)\b", re.I)

# 第 6 節：任何情況都不能出現的字樣
FORBIDDEN = {
    r"推甄": "升學資訊",
    r"讀書計畫": "個人規劃",
    r"我在哪裡學到|期末專案|課程作業|課堂實作": "個人經歷（AGENTS.md 第 5.2、6 節）",
    r"成績單|GPA|學號": "成績與學籍資訊",
    r"TMBA": "社團內部資訊（請改用泛稱）",
    r"[A-Za-z]:\\\\|[A-Za-z]:\\|/Users/|\\Users\\": "本機路徑",
    r"\.\./wiki|\braw/": "私人 wiki 路徑",
    r"[\w.+-]+@[\w-]+\.[\w.]+": "email",
    r"\bsk-[A-Za-z0-9]{16,}|api[_-]?key": "金鑰",
}

errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err(f"{path.relative_to(ROOT)} 無法解析：{e}")
        return None


def check_pages(pages, categories):
    cat_ids = {c["id"] for c in categories}
    seen = set()
    for i, p in enumerate(pages):
        where = f"pages.json[{i}] ({p.get('slug', '?')})"
        for k in REQUIRED:
            if k not in p:
                err(f"{where} 缺少欄位 {k}")
        slug = p.get("slug", "")
        if not SLUG_RE.match(slug):
            err(f"{where} slug 不是 kebab-case")
        if slug in seen:
            err(f"{where} slug 重複")
        seen.add(slug)
        if p.get("category") not in cat_ids:
            err(f"{where} category 不在 categories.json")
        if p.get("level") not in LEVELS:
            err(f"{where} level 必須是 {sorted(LEVELS)}")
        if p.get("status") not in STATUSES:
            err(f"{where} status 必須是 published 或 draft")
        if not DATE_RE.match(str(p.get("updated", ""))):
            err(f"{where} updated 格式應為 YYYY-MM-DD")
        n = len(p.get("summary", ""))
        if not 25 <= n <= 90:
            warn(f"{where} summary 長度 {n} 字（建議 40–70）")
        if not 2 <= len(p.get("tags", [])) <= 4:
            err(f"{where} tags 應為 2–4 個")
        if not 1 <= len(p.get("related", [])) <= 5:
            err(f"{where} related 應為 1–5 個")
    return seen


def check_related(pages):
    by_slug = {p["slug"]: p for p in pages if "slug" in p}
    published = {s for s, p in by_slug.items() if p.get("status") == "published"}
    for s, p in by_slug.items():
        if p.get("status") != "published":
            continue
        for r in p.get("related", []):
            if r == s:
                err(f"{s}: related 不能包含自己")
            elif r not in published:
                err(f"{s}: related 指向不存在或未發佈的頁面 {r}")
            elif s not in by_slug[r].get("related", []):
                err(f"{s} → {r} 不是雙向（請在 {r} 的 related 加上 {s}）")
    return published


def check_content(pages, published):
    files = {f.stem for f in CONTENT.glob("*.md")}
    slugs = {p["slug"] for p in pages if "slug" in p}
    for s in sorted(published - files):
        err(f"{s}: 在 pages.json 中已發佈，但缺少 content/concepts/{s}.md")
    for s in sorted(files - slugs):
        err(f"content/concepts/{s}.md 沒有對應的 pages.json 項目（孤兒頁）")

    for f in sorted(CONTENT.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        name = f"content/concepts/{f.name}"
        if text.lstrip().startswith("---"):
            err(f"{name} 不應有 YAML frontmatter（metadata 只放 pages.json）")
        if re.search(r"^# ", text, re.M):
            err(f"{name} 不應有一級標題（標題由網頁自動產生）")
        heads = re.findall(r"^## (.+?)\s*$", text, re.M)
        if heads != SECTIONS:
            err(f"{name} 二級標題應依序為 {SECTIONS}，實際為 {heads}")
        if HTML_RE.search(text):
            err(f"{name} 含有禁用的 HTML 標籤")
        for target in LINK_RE.findall(text):
            if target.strip() not in published:
                err(f"{name} 的 [[{target}]] 指向不存在或未發佈的頁面")
        if text.count("$$") % 2:
            err(f"{name} 的 $$ 數學區塊沒有成對")
        chars = len(re.sub(r"\s", "", text))
        if not 300 <= chars <= 1800:
            warn(f"{name} 長度約 {chars} 字（建議 400–1000）")


def private_names() -> set[str]:
    """從私人 wiki 的 people/ 取出人名（只在本機有私人 wiki 時運作）。"""
    names: set[str] = set()
    people = PRIVATE_WIKI / "people"
    if not people.is_dir():
        return names
    for f in people.glob("*.md"):
        first = f.read_text(encoding="utf-8").splitlines()[:1]
        if first:
            title = re.sub(r"^#\s*", "", first[0])
            for token in re.split(r"[（）()、,，/\s]+", title):
                if re.fullmatch(r"[一-鿿]{2,4}", token):
                    names.add(token)
    return names


def check_privacy():
    names = private_names()
    targets = [ROOT / "data" / "pages.json", *CONTENT.glob("*.md")]
    for f in targets:
        text = f.read_text(encoding="utf-8")
        rel = f.relative_to(ROOT)
        for pat, why in FORBIDDEN.items():
            m = re.search(pat, text, re.I)
            if m:
                err(f"{rel} 出現「{m.group(0)}」（{why}，AGENTS.md 第 6 節）")
        for n in names:
            if n in text:
                warn(f"{rel} 出現私人 wiki people/ 裡的人名「{n}」，"
                     "若不是已發表論文作者請移除")


def check_files():
    must = ["index.html", "concept.html", "about.html", ".nojekyll",
            "assets/css/style.css", "assets/js/site.js",
            "assets/vendor/marked/marked.min.js",
            "assets/vendor/katex/katex.min.js",
            "assets/vendor/katex/katex.min.css",
            "assets/vendor/katex/contrib/auto-render.min.js"]
    for m in must:
        if not (ROOT / m).exists():
            err(f"缺少必要檔案 {m}")


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):  # Windows 終端機中文輸出
        sys.stdout.reconfigure(encoding="utf-8")
    categories = load_json(ROOT / "data" / "categories.json") or []
    pages = load_json(ROOT / "data" / "pages.json") or []
    check_files()
    check_pages(pages, categories)
    published = check_related(pages)
    check_content(pages, published)
    check_privacy()

    print(f"頁面：{len(pages)}（已發佈 {len(published)}），分類：{len(categories)}")
    for w in warnings:
        print("WARNING:", w)
    for e in errors:
        print("ERROR:  ", e)
    if errors:
        print(f"\n{len(errors)} 個錯誤，請修正後再執行。")
        return 1
    print("\nALL CHECKS PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
