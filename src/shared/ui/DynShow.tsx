import { Text, View, router } from "@astralsight/astroforge-core";
import OnlineImage from "./OnlineImage";
import UserInfo from "./UserInfo";

interface Props {
  /** 来自 dynamicFeed 的单条 item 对象 */
  item: any;
}

// 动态卡片：根据 item.type 选择展示形态。这里只覆盖最常见的四种：
// DYNAMIC_TYPE_AV (视频)、DYNAMIC_TYPE_WORD (纯文本)、DYNAMIC_TYPE_DRAW (图文)、
// DYNAMIC_TYPE_FORWARD (转发)。其他类型回落到 modules.module_dynamic.desc.text。
export default function DynShow({ item }: Props) {
  const author = item?.modules?.module_author ?? {};
  const dyn = item?.modules?.module_dynamic ?? {};
  const type = item?.type as string;
  const text = dyn?.desc?.text ?? "";

  const onClick = () => {
    const id = item?.id_str;
    if (id) router.push({ uri: "pages/app/features/dynamic/detail", params: { id } });
  };

  return (
    <View className="flex w-full flex-col px-3 py-2" onClick={onClick}>
      <UserInfo mid={author?.mid} name={author?.name} face={author?.face} clickable={false} />
      {text ? <Text className="mt-2 text-sm text-white">{text}</Text> : null}
      {type === "DYNAMIC_TYPE_AV" && dyn?.major?.archive ? (
        <View className="mt-2 flex flex-row items-center rounded-md bg-gray-800 p-2">
          <OnlineImage src={dyn.major.archive.cover} className="h-12 w-20 rounded" />
          <Text className="ml-2 flex-1 text-xs text-gray-200">{dyn.major.archive.title}</Text>
        </View>
      ) : null}
      {type === "DYNAMIC_TYPE_DRAW" && dyn?.major?.draw ? (
        <View className="mt-2 flex flex-row flex-wrap">
          {(dyn.major.draw.items ?? []).slice(0, 3).map((pic: any) => (
            <OnlineImage key={pic.src} src={pic.src} className="mr-1 mt-1 h-16 w-16 rounded" />
          ))}
        </View>
      ) : null}
    </View>
  );
}
