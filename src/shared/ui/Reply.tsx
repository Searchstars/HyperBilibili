import { Image, Text, View } from "@astralsight/astroforge-core";
import OnlineImage from "./OnlineImage";
import { formatNumber, relativeTime } from "../util/format";

interface Props {
  /** /x/v2/reply 列表中的单项 */
  item: any;
  onClick?: () => void;
}

// 单条评论：头像 + 昵称 + 内容 + 时间 + 点赞数。
export default function Reply({ item, onClick }: Props) {
  const member = item?.member ?? {};
  const content = item?.content ?? {};
  const like = item?.like ?? 0;
  return (
    <View className="flex w-full flex-row items-start px-3 py-2" onClick={onClick}>
      <OnlineImage src={member.avatar} className="h-8 w-8 overflow-hidden rounded-full" placeholder="/common/default_profile_img.png" />
      <View className="ml-2 flex flex-1 flex-col">
        <Text className="text-xs text-gray-300">{member.uname ?? ""}</Text>
        <Text className="mt-1 text-sm text-white">{content.message ?? ""}</Text>
        <View className="mt-1 flex flex-row items-center">
          <Text className="text-xs text-gray-500">{relativeTime((item?.ctime ?? 0) * 1000)}</Text>
          <Image src="/common/reply_like.png" className="ml-3 h-3 w-3" />
          <Text className="ml-1 text-xs text-gray-500">{formatNumber(like)}</Text>
        </View>
      </View>
    </View>
  );
}
