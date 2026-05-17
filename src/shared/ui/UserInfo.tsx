import { Image, Text, View, router } from "@astralsight/astroforge-core";
import OnlineImage from "./OnlineImage";

interface Props {
  mid?: string | number;
  name?: string;
  face?: string;
  level?: number;
  isVip?: boolean;
  className?: string;
  /** 是否点击跳转用户页，默认 true。 */
  clickable?: boolean;
}

// 头像 + 昵称 + 等级 + VIP 角标的小组合件。
export default function UserInfo({ mid, name, face, level, isVip, className, clickable = true }: Props) {
  const onClick = () => {
    if (!clickable || !mid) return;
    router.push({ uri: "pages/user", params: { mid: String(mid) } });
  };
  return (
    <View className={`flex flex-row items-center ${className ?? ""}`} onClick={onClick}>
      <OnlineImage src={face} className="h-8 w-8 overflow-hidden rounded-full" placeholder="/common/default_profile_img.png" />
      <Text className={`ml-2 text-sm ${isVip ? "text-pink-400" : "text-white"}`}>{name ?? ""}</Text>
      {level ? (
        <Image
          src={`/common/bililevel/level_${Math.min(level, 6)}.png`}
          className="ml-1 h-3 w-7"
        />
      ) : null}
    </View>
  );
}
