import { Text, View } from "@astralsight/astroforge-core";
import { Button } from "./Button";

export interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorView({
  title = "出错了",
  message,
  onRetry,
  className,
}: ErrorViewProps) {
  return (
    <View
      className={`flex-col items-center justify-center ${className ?? ""}`}
      style={{ marginTop: "60px" }}
    >
      <Text className="text-[28px] font-semibold text-white">{title}</Text>
      {message && (
        <Text
          className="text-[20px] text-white"
          style={{ marginTop: "10px", width: "75%", textAlign: "center" }}
        >
          {message}
        </Text>
      )}
      {onRetry && (
        <Button text="重试" marginTop="25px" primary onClick={onRetry} />
      )}
    </View>
  );
}
