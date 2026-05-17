import { router, Text, View } from "@astralsight/astroforge-core";
import type { HtmlDocument } from "../utils/htmlparser";
import { OnlineImage } from "./OnlineImage";

export interface HtmlRendererProps {
  doms: HtmlDocument[];
  className?: string;
}

function styleFor(item: HtmlDocument): Record<string, string> | undefined {
  return item.style;
}

function renderDom(item: HtmlDocument, idx: number): any {
  const style = styleFor(item);

  switch (item.type) {
    case "p":
      return (
        <Text key={idx} style={{ fontSize: "26px", color: "white", ...style }}>
          {item.text}
        </Text>
      );
    case "h1":
      return (
        <Text key={idx} style={{ fontSize: "34px", fontWeight: "600", color: "white", ...style }}>
          {item.text}
        </Text>
      );
    case "h2":
      return (
        <Text key={idx} style={{ fontSize: "30px", fontWeight: "500", color: "white", ...style }}>
          {item.text}
        </Text>
      );
    case "span":
      return (
        <Text key={idx} style={{ fontSize: "24px", color: "white", ...style }}>
          {item.text}
        </Text>
      );
    case "strong":
      return (
        <Text key={idx} style={{ fontSize: "26px", fontWeight: "bold", color: "white", ...style }}>
          {item.text}
        </Text>
      );
    case "blockquote":
      return (
        <Text
          key={idx}
          style={{
            fontStyle: "italic",
            marginLeft: "10px",
            paddingLeft: "10px",
            color: "white",
            ...style,
          }}
        >
          {item.text}
        </Text>
      );
    case "br":
      return <View key={idx} style={{ marginTop: "2px", ...style }} />;
    case "img":
      return (
        <OnlineImage
          key={idx}
          src={item.attributes?.src ?? ""}
          marginTop="10px"
          objectFit="contain"
          lockSize
          width="100%"
          height="250px"
          style={style}
          onClick={(src) =>
            router.push({
              uri: "pages/tools/picturedetail",
              params: { img_uri: src },
            })
          }
        />
      );
    case "figure":
      return (
        <View key={idx} className="flex-col items-center" style={style}>
          {item.children && <HtmlRenderer doms={item.children} />}
        </View>
      );
    case "figcaption":
      return (
        <Text
          key={idx}
          style={{
            fontSize: "20px",
            color: "#555",
            marginTop: "5px",
            textAlign: "center",
            ...style,
          }}
        >
          {item.text}
        </Text>
      );
    case "text":
      return (
        <Text key={idx} style={{ fontSize: "26px", color: "white", ...style }}>
          {item.text}
        </Text>
      );
    case "hbhtmlrenderer-notsupportimage-tip":
      return (
        <Text key={idx} style={{ fontSize: "16px", color: "gray" }}>
          {item.text}
        </Text>
      );
    default:
      if (item.children && item.children.length > 0) {
        return (
          <View key={idx} className="flex-col" style={style}>
            <HtmlRenderer doms={item.children} />
          </View>
        );
      }
      if (item.text) {
        return (
          <Text key={idx} style={{ fontSize: "24px", color: "white", ...style }}>
            {item.text}
          </Text>
        );
      }
      return null;
  }
}

export function HtmlRenderer({ doms, className }: HtmlRendererProps) {
  if (!doms || doms.length === 0) return null;
  return (
    <View className={`flex-col ${className ?? ""}`}>
      {doms.map((item, idx) => renderDom(item, idx))}
    </View>
  );
}
