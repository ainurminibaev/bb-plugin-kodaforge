// The rendered side of a text file: Markdown as BB shows it in chat, SVG as an image.
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Markdown } from "@get-bb/plugin-sdk/app";
import { utf8WithMark, type TextPreview as Kind } from "@/lib/text-preview";
import { DocumentPreview } from "./PreviewView";

export function TextPreview({ kind, content, name, focused, assetsUrl }: { kind: Kind; content: string; name: string; focused: boolean; assetsUrl: string | null }) {
  // Typing in the source beside it must not wait for the preview.
  const shown = useDeferredValue(content);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focused) scroller.current?.focus();
  }, [focused]);
  if (kind === "csv") return assetsUrl === null ? null : <TablePreview content={shown} name={name} assetsUrl={assetsUrl} />;
  return (
    <div ref={scroller} tabIndex={-1} aria-label={`Preview of ${name}`} className="h-full overflow-auto bg-background outline-none">
      {kind === "markdown" ? (
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Markdown content={shown} />
        </div>
      ) : (
        <SvgImage source={shown} name={name} />
      )}
    </div>
  );
}

/** As an image, never as a document: scripts inside an SVG do not run. */
function SvgImage({ source, name }: { source: string; name: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const created = URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }));
    setUrl(created);
    return () => URL.revokeObjectURL(created);
  }, [source]);
  return <div className="flex min-h-full items-center justify-center p-4">{url === null ? null : <img src={url} alt={name} className="max-w-full" />}</div>;
}

/** A table in the spreadsheet viewer, drawn again once typing pauses. */
function TablePreview({ content, name, assetsUrl }: { content: string; name: string; assetsUrl: string }) {
  const [settled, setSettled] = useState(content);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSettled(content);
    }, 400);
    return () => clearTimeout(timer);
  }, [content]);
  if (error !== null) return <p role="status" className="p-6 text-sm text-muted-foreground">Could not show {name}: {error}</p>;
  return <DocumentPreview source={settled} load={() => Promise.resolve(utf8WithMark(settled))} name={name} viewer="sheet" assetsUrl={assetsUrl} onError={setError} />;
}
