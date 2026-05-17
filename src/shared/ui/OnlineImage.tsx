import { Image, useState, View } from "@astralsight/astroforge-core";
import { Loading } from "./Loading";

export interface OnlineImageProps {
  src: string;
  width?: string;
  height?: string;
  objectFit?: string;
  borderRadius?: string;
  marginTop?: string;
  lockSize?: boolean;
  loadingAnim?: boolean;
  onClick?: (uri: string) => void;
  onLoaded?: (uri: string) => void;
  className?: string;
  style?: Record<string, string>;
}

/**
 * 在线图片：使用 AstroForge Image 的 onComplete 事件做加载态切换，
 * 取代旧版 system.request.download → 临时文件路径 → file.delete 的复杂模式。
 */
export function OnlineImage({
  src,
  width = "100px",
  height = "100px",
  objectFit = "scale-down",
  borderRadius = "10px",
  marginTop = "0px",
  lockSize = false,
  loadingAnim = true,
  onClick,
  onLoaded,
  className,
  style,
}: OnlineImageProps) {
  const [loaded, setLoaded] = useState(false);

  const divStyle: Record<string, string> = {
    marginTop,
    borderRadius,
    justifyContent: "center",
    alignItems: "center",
    ...style,
  };
  if (lockSize) {
    divStyle.minWidth = width;
    divStyle.minHeight = height;
  }

  const imageStyle: Record<string, string> = {
    objectFit,
    borderRadius,
  };
  if (lockSize) {
    imageStyle.width = width;
    imageStyle.height = height;
  }

  const handleComplete = () => {
    setLoaded(true);
    onLoaded?.(src);
  };

  const handleClick = () => onClick?.(src);

  return (
    <View
      className={`flex items-center justify-center ${className ?? ""}`}
      style={divStyle}
      onClick={onClick ? handleClick : undefined}
    >
      <Image
        src={src}
        style={imageStyle}
        onComplete={handleComplete as any}
      />
      {!loaded && loadingAnim && (
        <View style={{ position: "absolute" }}>
          <Loading size={40} />
        </View>
      )}
    </View>
  );
}
