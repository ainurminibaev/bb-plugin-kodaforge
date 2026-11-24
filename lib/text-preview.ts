/** Text files that open as a preview, with their source one click away. */
export type TextPreview = "markdown" | "svg" | "csv";

export function textPreview(path: string): TextPreview | null {
  if (/\.(md|markdown|mdown)$/i.test(path)) return "markdown";
  if (/\.(csv|tsv)$/i.test(path)) return "csv";
  return /\.svg$/i.test(path) ? "svg" : null;
}

/** For the spreadsheet viewer, which takes UTF-8 for granted only after a byte-order mark. */
export function utf8WithMark(text: string): ArrayBuffer {
  return new TextEncoder().encode(text.startsWith("\uFEFF") ? text : `\uFEFF${text}`).buffer as ArrayBuffer;
}

/** Whether a tab shows its preview: per group, so source and preview can sit side by side. */
export function sourceKey(groupId: number, path: string): string {
  return `${groupId}:${path}`;
}

/** Forget the choice for tabs that are gone. Returns the same set when nothing changed. */
export function keepOpenTabs(source: ReadonlySet<string>, groups: readonly { id: number; tabs: readonly string[] }[]): ReadonlySet<string> {
  const open = new Set(groups.flatMap((group) => group.tabs.map((path) => sourceKey(group.id, path))));
  const kept = [...source].filter((key) => open.has(key));
  return kept.length === source.size ? source : new Set(kept);
}
