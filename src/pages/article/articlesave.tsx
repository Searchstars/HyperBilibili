import { Image, Text, View, router } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";

// 旧版 articlesave 是个让用户跳转到 web 端复制内容的纯指引页。保持原本职能。
export default function ArticleSave() {
  return (
    <PageShell>
      <TitleBar title="收藏指引" />
      <View className="flex flex-1 flex-col items-center justify-center px-6">
        <Image src="/common/articlesave_tips.png" className="h-20 w-20" />
        <Text className="mt-4 text-center text-sm text-white">请在手机端复制文章链接到本应用打开。</Text>
        <View
          className="mt-6 rounded-full bg-pink-600 px-4 py-2"
          onClick={() => router.back()}
        >
          <Text className="text-sm text-white">我知道了</Text>
        </View>
      </View>
    </PageShell>
  );
}
