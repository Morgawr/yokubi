import json
import re
import sys


def furi_replace(text):
    # ex format: {f|翌|よく}{f|日|び}
    return re.sub(r"\{f\|([^{}|\n]+)\|([^{}|\n]+)\}", r"<ruby>\1<rt>\2</rt></ruby>", text)


def process_chapters(items):
    for item in items:
        if "Chapter" in item:
            chapter = item["Chapter"]
            chapter["content"] = furi_replace(chapter["content"])
            process_chapters(chapter.get("sub_items", []))



def main():
    if len(sys.argv) > 1 and sys.argv[1] == "supports":
        sys.exit(0)

    try:
        _, book = json.load(sys.stdin)
        process_chapters(book.get("items", []))
        json.dump(book, sys.stdout, ensure_ascii=False)
    except Exception:
        sys.exit(1)


if __name__ == "__main__":
    main()
