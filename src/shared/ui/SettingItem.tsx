import { Image, Text, View } from "@astralsight/astroforge-core";

interface Props {
  icon?: string;
  label?: string;
  /** 右侧附属说明，如版本号 / 当前值 */
  value?: string;
  onClick?: () => void;
}

// 设置页 / 关于页通用列表项。
export default function SettingItem({ icon, label, value, onClick }: Props) {
  return (
    <View className="flex w-full flex-row items-center px-4 py-3" onClick={onClick}>
      {icon ? <Image src={icon} className="mr-3 h-5 w-5" /> : null}
      <Text className="flex-1 text-sm text-white">{label ?? ""}</Text>
      {value ? <Text className="ml-2 text-xs text-gray-400">{value}</Text> : null}
      <Image src="/common/arrow_right.png" className="ml-2 h-4 w-4" />
    </View>
  );
}
