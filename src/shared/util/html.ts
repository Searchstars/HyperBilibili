// 极简 HTML 渲染前处理。旧版 htmlparser 试图把任意富文本树解构为快应用组件树，
// 工作量巨大且 bug 多。新版策略：对 B 站接口返回的"半结构化"富文本只做最小处理，
// 真要渲染时统一交给 <RichText>（runtime-vela 已支持）。
//
// 该模块只负责：URL 高亮、emoji 占位符替换、纯文本提取。

const URL_RE = /(https?:\/\/[^\s<>"]+)/g;

export function linkifyText(input: string): string {
  return input.replace(URL_RE, (url) => `<a href="${url}">${url}</a>`);
}

export function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "").trim();
}

// B 站 emoji 在文本内以 "[doge]" 等占位符出现；如果不替换则原样显示。
// 这里只做转义保护，让前端 <Text> 不会因为方括号误解析。
export function escapeForText(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
