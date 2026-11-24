import { describe, expect, it } from "vitest";
import { keepOpenTabs, sourceKey, textPreview, utf8WithMark } from "./text-preview.js";

describe("textPreview", () => {
  it("covers tables as text", () => {
    expect(textPreview("data/Отчёт.CSV")).toBe("csv");
    expect(textPreview("a.tsv")).toBe("csv");
    expect([...new Uint8Array(utf8WithMark("a")).slice(0, 4)]).toEqual([0xef, 0xbb, 0xbf, 0x61]);
    expect(utf8WithMark("\uFEFFa")).toHaveProperty("byteLength", 4);
  });
  it("covers Markdown and SVG, whatever the case or folder", () => {
    expect(textPreview("README.md")).toBe("markdown");
    expect(textPreview("docs/Очень длинное имя.MD")).toBe("markdown");
    expect(textPreview("a/logo.svg")).toBe("svg");
    for (const path of ["a.mdx", "readme", "x.md/y.ts", "main.py"]) expect(textPreview(path)).toBeNull();
  });
});

describe("keepOpenTabs", () => {
  it("drops closed tabs, keeps the rest, and is stable when nothing closed", () => {
    const source = new Set([sourceKey(0, "a.md"), sourceKey(1, "a.md")]);
    expect(keepOpenTabs(source, [{ id: 0, tabs: ["a.md"] }, { id: 1, tabs: ["a.md"] }])).toBe(source);
    expect([...keepOpenTabs(source, [{ id: 0, tabs: ["a.md"] }])]).toEqual([sourceKey(0, "a.md")]);
  });
});
