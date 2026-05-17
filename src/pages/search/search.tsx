import { Image, Input, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import { searchHotwords } from "../../shared/api/search";

// 搜索首页：输入框 + 热搜词。
export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [hot, setHot] = useState<any[]>([]);

  useEffect(() => {
    searchHotwords()
      .then((list) => setHot(list.slice(0, 10)))
      .catch(() => setHot([]));
  }, []);

  const goSearch = (k: string) => {
    const text = (k ?? "").trim();
    if (!text) return;
    router.push({ uri: "pages/search/searchresult", params: { keyword: text } });
  };

  return (
    <PageShell>
      <TitleBar title="搜索" />
      <View className="mx-3 flex flex-row items-center rounded-full bg-gray-900 px-3 py-1">
        <Image src="/common/searchpage_search.png" className="h-4 w-4" />
        <Input
          type="text"
          value={keyword}
          placeholder="想看点什么"
          className="ml-2 h-8 flex-1 text-sm text-white"
          onChange={(evt: any) => setKeyword(evt?.value ?? evt?.detail?.value ?? "")}
        />
        <Text className="ml-2 text-xs text-pink-400" onClick={() => goSearch(keyword)}>
          搜索
        </Text>
      </View>
      <View className="mx-3 mt-4 flex flex-row items-center">
        <Image src="/common/searchpage_fire.png" className="h-4 w-4" />
        <Text className="ml-2 text-sm text-white">热搜</Text>
      </View>
      <View className="mx-3 mt-2 flex flex-row flex-wrap">
        {hot.map((h) => (
          <View
            key={h.keyword}
            className="m-1 rounded-full bg-gray-800 px-3 py-1"
            onClick={() => goSearch(h.keyword)}
          >
            <Text className="text-xs text-gray-200">{h.keyword}</Text>
          </View>
        ))}
      </View>
    </PageShell>
  );
}
