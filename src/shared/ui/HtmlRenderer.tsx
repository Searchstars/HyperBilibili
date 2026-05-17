import { RichText, View } from "@astralsight/astroforge-core";

interface Props {
  html: string;
  className?: string;
}

// 旧版 htmlparser 自己拆 HTML 为快应用元素树（万行级实现）；新版直接交给
// Vela 内置 <richtext>，限制是不能注入交互，但足够展示 EULA / 文章正文 /
// 系统通知。
export default function HtmlRenderer({ html, className }: Props) {
  return (
    <View className={className ?? "w-full px-3"}>
      <RichText>{html}</RichText>
    </View>
  );
}
