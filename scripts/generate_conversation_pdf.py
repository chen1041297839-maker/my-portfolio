from __future__ import annotations

import html
import hashlib
import re
from pathlib import Path

from PIL import Image as PILImage, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "CONVERSATION_ARCHIVE.md"
OUTPUT = ROOT / "output" / "pdf" / "CONVERSATION_ARCHIVE.pdf"
THUMB_DIR = ROOT / "tmp" / "pdfs" / "conversation-thumbnails"

PAGE_W, PAGE_H = A4
ACCENT = colors.HexColor("#7C5CFF")
ORANGE = colors.HexColor("#FF6242")
INK = colors.HexColor("#17151D")
MUTED = colors.HexColor("#68636F")
PANEL = colors.HexColor("#F4F1FA")
DARK = colors.HexColor("#0C0B10")

pdfmetrics.registerFont(TTFont("HeitiLight", "/System/Library/Fonts/STHeiti Light.ttc", subfontIndex=0))


def clean_text(value: str) -> str:
    """Keep the transcript readable while avoiding unsupported emoji glyph boxes."""
    replacements = {
        "✅": "[完成]",
        "❌": "[错误]",
        "✨": "[亮点]",
        "👇": "[向下]",
        "⬇": "[向下]",
        "🟢": "[绿色状态]",
        "🔴": "[红色状态]",
        "🟡": "[黄色状态]",
        "💡": "[提示]",
        "🚀": "[发布]",
        "📌": "[重点]",
    }
    for source, target in replacements.items():
        value = value.replace(source, target)
    # Supplementary-plane symbols are mainly emoji. Preserve their existence as text.
    value = re.sub(
        r"[\U00010000-\U0010ffff]",
        lambda match: f"[emoji U+{ord(match.group(0)):X}]",
        value,
    )
    return value


def inline_markup(value: str) -> str:
    value = clean_text(value)
    value = html.escape(value, quote=False)
    value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"<u>\1</u> (\2)", value)
    value = re.sub(r"`([^`]+)`", r"<font color='#564D66'>\1</font>", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    return value


def para(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(inline_markup(text).replace("\n", "<br/>"), style)


def page_decoration(canvas, doc):
    page = canvas.getPageNumber()
    canvas.saveState()
    if page == 1:
        canvas.setFillColor(DARK)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor("#2A164C"))
        canvas.circle(PAGE_W - 10 * mm, PAGE_H - 12 * mm, 62 * mm, fill=1, stroke=0)
    else:
        canvas.setStrokeColor(colors.HexColor("#DDD8E5"))
        canvas.line(20 * mm, PAGE_H - 14 * mm, PAGE_W - 20 * mm, PAGE_H - 14 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont("HeitiLight", 7.5)
        canvas.drawString(20 * mm, PAGE_H - 10.5 * mm, "陈馨语作品集网站改版 - 对话归档")
        canvas.drawRightString(PAGE_W - 20 * mm, 10 * mm, f"{page}")
    canvas.restoreState()


base = getSampleStyleSheet()
styles = {
    "cover_title": ParagraphStyle(
        "cover_title",
        parent=base["Title"],
        fontName="HeitiLight",
        fontSize=27,
        leading=36,
        textColor=colors.white,
        alignment=TA_LEFT,
        spaceAfter=8 * mm,
    ),
    "cover_sub": ParagraphStyle(
        "cover_sub",
        fontName="HeitiLight",
        fontSize=10.5,
        leading=17,
        textColor=colors.HexColor("#BDB5C8"),
        spaceAfter=8 * mm,
    ),
    "cover_label": ParagraphStyle(
        "cover_label",
        fontName="HeitiLight",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#BDAEFF"),
        spaceAfter=3 * mm,
    ),
    "cover_instruction": ParagraphStyle(
        "cover_instruction",
        fontName="HeitiLight",
        fontSize=10,
        leading=17,
        textColor=colors.white,
        backColor=colors.HexColor("#191520"),
        borderColor=ACCENT,
        borderWidth=1,
        borderPadding=10,
        borderRadius=8,
        spaceAfter=6 * mm,
    ),
    "h1": ParagraphStyle(
        "h1",
        fontName="HeitiLight",
        fontSize=20,
        leading=28,
        textColor=INK,
        spaceBefore=6 * mm,
        spaceAfter=4 * mm,
        keepWithNext=True,
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName="HeitiLight",
        fontSize=13,
        leading=19,
        textColor=INK,
        spaceBefore=5 * mm,
        spaceAfter=2.5 * mm,
        keepWithNext=True,
    ),
    "user": ParagraphStyle(
        "user",
        fontName="HeitiLight",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#513CC5"),
        spaceBefore=3 * mm,
        spaceAfter=1.5 * mm,
        keepWithNext=True,
    ),
    "assistant": ParagraphStyle(
        "assistant",
        fontName="HeitiLight",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#B43E25"),
        spaceBefore=3 * mm,
        spaceAfter=1.5 * mm,
        keepWithNext=True,
    ),
    "body": ParagraphStyle(
        "body",
        fontName="HeitiLight",
        fontSize=8.2,
        leading=12.5,
        textColor=INK,
        spaceAfter=1.6 * mm,
        splitLongWords=True,
    ),
    "quote": ParagraphStyle(
        "quote",
        fontName="HeitiLight",
        fontSize=8.2,
        leading=12.8,
        textColor=INK,
        leftIndent=6 * mm,
        rightIndent=2 * mm,
        borderColor=colors.HexColor("#9B83FF"),
        borderWidth=1.2,
        borderPadding=6,
        backColor=PANEL,
        spaceBefore=1.5 * mm,
        spaceAfter=2.5 * mm,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        fontName="HeitiLight",
        fontSize=8.2,
        leading=12.5,
        leftIndent=5 * mm,
        firstLineIndent=-3 * mm,
        textColor=INK,
        spaceAfter=1 * mm,
    ),
    "caption": ParagraphStyle(
        "caption",
        fontName="HeitiLight",
        fontSize=7,
        leading=10,
        textColor=MUTED,
        alignment=TA_CENTER,
        spaceAfter=3 * mm,
    ),
}


def add_image(story, relative_path: str, label: str) -> None:
    path = ROOT / relative_path
    if not path.exists():
        story.append(para(f"图片附件未能归档：{relative_path}", styles["caption"]))
        return
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha1(str(path).encode("utf-8")).hexdigest()[:12]
    thumb_path = THUMB_DIR / f"{path.stem}-{digest}.jpg"
    if not thumb_path.exists():
        with PILImage.open(path) as source:
            source = ImageOps.exif_transpose(source)
            if source.mode in ("RGBA", "LA"):
                canvas = PILImage.new("RGB", source.size, "white")
                canvas.paste(source, mask=source.getchannel("A"))
                source = canvas
            else:
                source = source.convert("RGB")
            source.thumbnail((1600, 1200), PILImage.Resampling.LANCZOS)
            source.save(thumb_path, "JPEG", quality=78, optimize=True, progressive=True)
    with PILImage.open(thumb_path) as im:
        width, height = im.size
    max_w = PAGE_W - 44 * mm
    max_h = 78 * mm
    scale = min(max_w / width, max_h / height, 1)
    image = Image(str(thumb_path), width=width * scale, height=height * scale)
    image.hAlign = "CENTER"
    story.append(KeepTogether([image, para(label, styles["caption"])]))


def build_story(markdown: str):
    story = []
    first_instruction = (
        "请先克隆或更新仓库 chen1041297839-maker/my-portfolio，切换到 second 分支，"
        "不要修改 main。按顺序完整阅读 HANDOFF.md、PRODUCT.md、DESIGN.md、"
        ".impeccable/design.json 和 CONVERSATION_ARCHIVE.md，再检查代码、资源和 Git 状态。"
        "运行 npm install 与 npm run dev -- --host 127.0.0.1 --port 5174。修改前先复述目标、"
        "完成项、未完成项、必须保留的交互/数据/图片/Figma frame/Gemini 功能及禁区。"
        "不要删除现有项目数据、原图、可交互 Figma frame 或 Gemini 代码；未经明确授权不要提交或推送。"
    )
    story.extend(
        [
            Spacer(1, 20 * mm),
            para("陈馨语作品集网站改版", styles["cover_title"]),
            para("完整对话归档 / 设计决策、需求迭代与代码实施记录", styles["cover_sub"]),
            para("新环境第一条操作指令", styles["cover_label"]),
            para(first_instruction, styles["cover_instruction"]),
            para(
                "分支：second　·　导出日期：2026-07-22　·　完整可搜索版本：CONVERSATION_ARCHIVE.md",
                styles["cover_sub"],
            ),
            PageBreak(),
        ]
    )

    lines = markdown.splitlines()
    # Skip YAML and the duplicate cover/first-instruction section.
    start = next((i for i, line in enumerate(lines) if line.startswith("## 最初的项目指令")), 0)
    lines = lines[start:]
    quote_lines = []

    def flush_quote():
        nonlocal quote_lines
        if quote_lines:
            story.append(para("\n".join(quote_lines), styles["quote"]))
            quote_lines = []

    for line in lines:
        if line.startswith("> "):
            quote_lines.append(line[2:])
            continue
        flush_quote()
        stripped = line.strip()
        if not stripped or stripped == "---":
            story.append(Spacer(1, 1.2 * mm))
            continue
        image_match = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", stripped)
        if image_match:
            add_image(story, image_match.group(2), image_match.group(1))
            continue
        if stripped == "# 完整时间线":
            story.append(PageBreak())
            story.append(para("完整时间线", styles["h1"]))
        elif line.startswith("# "):
            story.append(para(line[2:], styles["h1"]))
        elif line.startswith("## "):
            story.append(para(line[3:], styles["h2"]))
        elif line.startswith("### 用户"):
            story.append(para(line[4:], styles["user"]))
        elif line.startswith("### 助手"):
            story.append(para(line[4:], styles["assistant"]))
        elif line.startswith("### "):
            story.append(para(line[4:], styles["h2"]))
        elif line.startswith("- "):
            story.append(para("• " + line[2:], styles["bullet"]))
        else:
            story.append(para(line, styles["body"]))
    flush_quote()
    return story


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    markdown = SOURCE.read_text(encoding="utf-8")
    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=16 * mm,
        title="陈馨语作品集网站改版 - 完整对话归档",
        author="Xinyu Chen & Codex",
        subject="Portfolio redesign conversation archive",
    )
    document.build(build_story(markdown), onFirstPage=page_decoration, onLaterPages=page_decoration)
    print(OUTPUT)


if __name__ == "__main__":
    main()
