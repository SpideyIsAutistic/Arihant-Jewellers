/** Tiny, safe renderer for admin-authored text: "## Heading", "- bullet", blank-line paragraphs. No HTML. */
export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="prose-store text-[15px] leading-[1.75] text-body2 sm:text-[16px]">
      {blocks.map((b, i) => {
        const t = b.trim();
        if (t.startsWith("## ")) return <h2 key={i} className="text-ink">{t.slice(3)}</h2>;
        if (t.startsWith("### ")) return <h3 key={i} className="text-ink">{t.slice(4)}</h3>;
        const lines = t.split("\n");
        if (lines.every((l) => l.trim().startsWith("- ")))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.trim().slice(2)}</li>
              ))}
            </ul>
          );
        if (lines[0].startsWith("## "))
          return (
            <div key={i}>
              <h2 className="text-ink">{lines[0].slice(3)}</h2>
              <p>{lines.slice(1).join(" ")}</p>
            </div>
          );
        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}
