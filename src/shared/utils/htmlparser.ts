// htmlparser.ts — 与旧版 src/htmlparser.ts 字面对齐。
// 用于 eularead / articleshow 等页面把后端 HTML 字符串解析成 dom tree。

export interface HtmlDocument {
  type: string;
  text?: string;
  style?: Record<string, string>;
  attributes?: Record<string, string>;
  children?: HtmlDocument[];
}

const htmlEntities: Record<string, string> = {
  nbsp: " ",
  lt: "<",
  gt: ">",
  amp: "&",
  quot: '"',
  apos: "'",
};

function decodeEntities(text: string): string {
  return text.replace(/&([^;]+);/g, (m, entity) => htmlEntities[entity] || m);
}

function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const selfClosingTags = new Set([
  "img", "br", "hr", "input", "meta", "link", "area", "base",
  "col", "command", "embed", "keygen", "param", "source", "track", "wbr",
]);

export function parseContentHtml(html: string, processSelfClosingTags: boolean = true): HtmlDocument[] {
  const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
  const selfClosingTagRegex = /<(\w+)([^>]*)\/>/g;

  const elements: HtmlDocument[] = [];
  let lastIndex = 0;

  if (processSelfClosingTags) {
    html = html.replace(selfClosingTagRegex, (_m, tagName, attributes) => {
      elements.push({
        type: tagName,
        attributes: parseAttributes(attributes),
        style: parseStyle(attributes),
        children: [],
      });
      return "";
    });

    selfClosingTags.forEach((tag) => {
      const regex = new RegExp(`<${tag}([^>]*)>`, "g");
      html = html.replace(regex, (_m, attributes) => {
        elements.push({
          type: tag,
          attributes: parseAttributes(attributes),
          style: parseStyle(attributes),
          children: [],
        });
        return "";
      });
    });
  }

  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const [, tagName, attributes, innerHTML] = match;

    if (match.index > lastIndex) {
      const textContent = html.slice(lastIndex, match.index);
      if (textContent.trim()) {
        elements.push({
          type: "text",
          text: decodeEntities(stripHtmlTags(textContent.trim())),
        });
      }
    }

    if (["p", "h1", "h2", "span", "strong", "blockquote", "a"].includes(tagName)) {
      elements.push({
        type: tagName,
        style: parseStyle(attributes),
        attributes: parseAttributes(attributes),
        text: decodeEntities(stripHtmlTags(innerHTML.trim())),
      });
    } else {
      const children = parseContentHtml(innerHTML);
      elements.push({
        type: tagName,
        style: parseStyle(attributes),
        attributes: parseAttributes(attributes),
        children: children.length > 0 ? children : undefined,
      });
    }
    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < html.length) {
    const textContent = html.slice(lastIndex);
    if (textContent.trim()) {
      elements.push({
        type: "text",
        text: decodeEntities(stripHtmlTags(textContent.trim())),
      });
    }
  }
  return elements;
}

function parseStyle(attributes: string): Record<string, string> | undefined {
  const m = attributes.match(/style="([^"]*)"/);
  if (!m) return undefined;
  return m[1].split(";").reduce<Record<string, string>>((obj, pair) => {
    const [k, v] = pair.split(":").map((s) => s.trim());
    if (k && v) obj[k] = v;
    return obj;
  }, {});
}

function parseAttributes(attributeString: string): Record<string, string> {
  const regex = /(\w+)="([^"]*)"/g;
  const attrs: Record<string, string> = {};
  let m;
  while ((m = regex.exec(attributeString)) !== null) attrs[m[1]] = m[2];
  return attrs;
}
