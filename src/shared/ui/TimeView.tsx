import { Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import { useDeviceInfo } from "../hooks/useDeviceInfo";

function pad(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

export interface TimeViewProps {
  className?: string;
}

export function TimeView({ className }: TimeViewProps) {
  const [time, setTime] = useState(() => new Date());
  const device = useDeviceInfo();
  const isRect = device?.screenShape === "rect";

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 2000);
    return () => clearInterval(id);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const hourHigh = String(Math.floor(hours / 10));
  const hourLow = String(hours % 10);
  const minuteHigh = String(Math.floor(minutes / 10));
  const minuteLow = String(minutes % 10);

  if (isRect) {
    return (
      <View
        className={`absolute top-0 flex-row items-center justify-center ${className ?? ""}`}
        style={{ right: "100px" }}
      >
        <Text className="text-[30px] font-semibold text-white">
          {pad(hours) + ":" + pad(minutes)}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`absolute flex-row items-center justify-center ${className ?? ""}`}
      style={{ top: "3.5px" }}
    >
      <View className="flex-row justify-start">
        <Text className="text-[25px] font-semibold text-white" style={{ top: "2px" }}>{hourHigh}</Text>
        <Text className="text-[25px] font-semibold text-white" style={{ top: "2px" }}>{hourLow}</Text>
        <Text className="text-[25px] font-semibold text-white" style={{ top: "2px" }}>:</Text>
        <Text className="text-[25px] font-semibold text-white" style={{ top: "2px" }}>{minuteHigh}</Text>
        <Text className="text-[25px] font-semibold text-white" style={{ top: "2px" }}>{minuteLow}</Text>
      </View>
    </View>
  );
}
