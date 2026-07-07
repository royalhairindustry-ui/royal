// Minimal, safe markdown -> HTML renderer for blog body content.
// Supports: headings (#..######), bold (**), italic (*), inline code (`),
// links [t](u), images ![a](u), unordered/ordered lists, blockquotes, hr,
// fenced code blocks ```, and paragraphs with single line breaks.

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(s: string) {
  let out = escapeHtml(s);
  // images first so they don't get caught by links
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    '<img alt="$1" src="$2" class="my-6 rounded-2xl w-full h-auto" />',
  );
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" class="underline hover:opacity-70" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  out = out.replace(/`([^`]+)`/g, '<code class="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.92em]">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return out;
}

export function renderMarkdown(md: string): string {
  if (!md) return "";
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];

  let i = 0;
  let inUl = false;
  let inOl = false;
  let inP: string[] = [];

  const closeP = () => {
    if (inP.length) {
      html.push(`<p>${inline(inP.join(" "))}</p>`);
      inP = [];
    }
  };
  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // fenced code block
    if (/^```/.test(line)) {
      closeP();
      closeLists();
      const lang = line.replace(/^```\s*/, "");
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      html.push(
        `<pre class="my-6 overflow-x-auto rounded-xl bg-zinc-900 p-4 text-[13px] text-zinc-100"><code${
          lang ? ` class="lang-${escapeHtml(lang)}"` : ""
        }>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
      );
      continue;
    }

    // blank line
    if (line.trim() === "") {
      closeP();
      closeLists();
      i++;
      continue;
    }

    // hr
    if (/^---+$/.test(line.trim())) {
      closeP();
      closeLists();
      html.push('<hr class="my-8 border-zinc-200" />');
      i++;
      continue;
    }

    // headings
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      closeP();
      closeLists();
      const level = h[1].length;
      const sizes = [
        "",
        "text-[34px] md:text-[44px] font-black tracking-tight mt-10 mb-4",
        "text-[26px] md:text-[32px] font-bold tracking-tight mt-8 mb-3",
        "text-[20px] md:text-[24px] font-bold tracking-tight mt-6 mb-2",
        "text-[18px] md:text-[20px] font-semibold mt-5 mb-2",
        "text-[16px] md:text-[18px] font-semibold mt-4 mb-2",
        "text-[14px] md:text-[16px] font-semibold mt-4 mb-2 uppercase tracking-wider",
      ];
      html.push(
        `<h${level} class="${sizes[level]}">${inline(h[2].trim())}</h${level}>`,
      );
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      closeP();
      closeLists();
      const quoted: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(
        `<blockquote class="my-6 border-l-4 border-zinc-300 pl-4 italic text-zinc-600">${inline(
          quoted.join(" "),
        )}</blockquote>`,
      );
      continue;
    }

    // unordered list
    if (/^[-*+]\s+/.test(line)) {
      closeP();
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        html.push('<ul class="my-4 list-disc space-y-2 pl-6">');
        inUl = true;
      }
      html.push(`<li>${inline(line.replace(/^[-*+]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(line)) {
      closeP();
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        html.push('<ol class="my-4 list-decimal space-y-2 pl-6">');
        inOl = true;
      }
      html.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // paragraph line
    closeLists();
    inP.push(line);
    i++;
  }

  closeP();
  closeLists();

  return html.join("\n");
}
