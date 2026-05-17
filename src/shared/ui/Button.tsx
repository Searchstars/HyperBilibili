import { Text, View } from "@astralsight/astroforge-core";
import { t } from "../i18n";

export interface ButtonProps {
  /** i18n key 或直接文本 */
  text: string;
  primary?: boolean;
  disabled?: boolean;
  marginTop?: string;
  onClick?: () => void;
  className?: string;
  style?: Record<string, string>;
}

export function Button({
  text,
  primary = false,
  disabled = false,
  marginTop,
  onClick,
  className,
  style,
}: ButtonProps) {
  const bgColor = disabled ? "#262626" : primary ? "#FF7DA8" : "#262626";
  const textColor = disabled ? "#5F5F5F" : "#FFFFFF";

  const handleClick = () => {
    if (!disabled) onClick?.();
  };

  const mergedStyle: Record<string, string> = {
    width: "322px",
    height: "80px",
    borderRadius: "90px",
    backgroundColor: bgColor,
    ...style,
  };
  if (marginTop) mergedStyle.marginTop = marginTop;

  return (
    <View
      className={`flex items-center justify-center ${className ?? ""}`}
      style={mergedStyle}
      onClick={handleClick}
    >
      <Text
        style={{ fontSize: "40px", fontWeight: "600", color: textColor }}
      >
        {t(text)}
      </Text>
    </View>
  );
}
