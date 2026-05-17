import { Image, Text, View, router } from "@astralsight/astroforge-core";

interface Props {
  title?: string;
  /** 默认调用 router.back()。如果在登录前的入口页禁用返回，可传 false。 */
  showBack?: boolean;
  /** 额外右侧操作区由 children 渲染。 */
  children?: any;
}

// 24px 高的顶栏，左侧返回箭头，居中标题，右侧操作槽位。
// 用 absolute + z-index 也行，但旧版黑底无需 hairline，flex-row 足够。
export default function TitleBar({ title, showBack = true, children }: Props) {
  return (
    <View className="flex h-12 w-full flex-row items-center justify-between px-3">
      <View className="flex h-8 w-8 items-center justify-center" onClick={() => router.back()}>
        {showBack ? <Image src="/common/back.png" className="h-6 w-6" /> : null}
      </View>
      <Text className="flex-1 text-center text-base">{title ?? ""}</Text>
      <View className="flex h-8 w-8 items-center justify-center">{children}</View>
    </View>
  );
}
