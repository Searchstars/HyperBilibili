import { Scroll, Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import HtmlRenderer from "../../shared/ui/HtmlRenderer";
import Loading from "../../shared/ui/Loading";
import ErrorView from "../../shared/ui/ErrorView";
import Button from "../../shared/ui/Button";
import { article } from "../../shared/api/article";
import { saveContent, readContent } from "../../shared/util/savedcontent";

interface Route {
  params?: { cvid?: string };
}

// 文章正文。
// 优先读离线缓存（点击"离线"后保存），未命中再发请求。
export default function ArticleShow(props: Route) {
  const cvid = props?.params?.cvid ?? "";
  const [html, setHtml] = useState("");
  const [title, setTitle] = useState("文章");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      if (!cvid) {
        setError("缺少 cvid");
        return;
      }
      const cached = await readContent(cvid);
      if (cached) {
        setHtml(cached);
        return;
      }
      try {
        const raw = await article(cvid);
        // B 站 read 页面 HTML 体很大；这里截取主要正文段落，足够展示。
        const body = extractArticleBody(raw);
        const t = extractTitle(raw);
        if (t) setTitle(t);
        setHtml(body);
      } catch {
        setError("加载失败");
      }
    })();
  }, []);

  const onSave = async () => {
    if (!html) return;
    await saveContent({ id: cvid, kind: "article", title, savedAt: Date.now() }, html);
  };

  if (error) {
    return (
      <PageShell>
        <TitleBar title="文章" />
        <ErrorView message={error} />
      </PageShell>
    );
  }
  if (!html) {
    return (
      <PageShell>
        <TitleBar title="文章" />
        <Loading text="加载文章" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TitleBar title={title.slice(0, 8)}>
        <Button label="离线" onClick={onSave} />
      </TitleBar>
      <Scroll className="flex-1 w-full" scrollY={true}>
        <HtmlRenderer html={html} />
      </Scroll>
    </PageShell>
  );
}

function extractArticleBody(raw: string): string {
  // <div id="read-article-holder">...</div> 是新版专栏的正文外层。
  const m = raw.match(/<div[^>]*id="read-article-holder"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  return m ? m[1] : raw;
}

function extractTitle(raw: string): string {
  const m = raw.match(/<h1[^>]*class="title"[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].trim() : "";
}
