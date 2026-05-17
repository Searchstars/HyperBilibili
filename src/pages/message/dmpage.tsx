import { Image, Input, Scroll, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import Loading from "../../shared/ui/Loading";
import { dmSessionMessages, sendDM } from "../../shared/api/message";
import { state } from "../../shared/api/state";

interface Route {
  params?: { mid?: string };
}

export default function DmPage(props: Route) {
  const mid = props?.params?.mid ?? "";
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!mid) return;
    try {
      const data = await dmSessionMessages(1, mid, 20);
      setMessages((data?.messages ?? []).reverse());
    } catch {
      // 与会话拿不到一样，保持当前列表不动
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const send = async () => {
    if (!draft) return;
    try {
      await sendDM(mid, 1, draft);
      setDraft("");
      await refresh();
    } catch {
      // 网络错误不弹窗，避免抖动；下次拉取会重试。
    }
  };

  return (
    <PageShell>
      <TitleBar title="私信" />
      {loading ? (
        <Loading text="加载消息" />
      ) : (
        <Scroll className="flex-1 w-full" scrollY={true}>
          {messages.map((m) => {
            const isMe = String(m.sender_uid) === String(state.accountInfo?.mid ?? "");
            const content = parseContent(m.content);
            return (
              <View
                key={m.msg_seqno}
                className={`mx-3 my-1 flex flex-row ${isMe ? "justify-end" : "justify-start"}`}
              >
                <View className={`max-w-3/4 rounded-lg px-3 py-2 ${isMe ? "bg-pink-600" : "bg-gray-800"}`}>
                  <Text className="text-sm text-white">{content}</Text>
                </View>
              </View>
            );
          })}
        </Scroll>
      )}
      <View className="flex flex-row items-center bg-gray-900 px-2 py-2">
        <Input
          type="text"
          value={draft}
          placeholder="说点什么"
          className="h-9 flex-1 rounded-full bg-gray-800 px-3 text-sm text-white"
          onChange={(evt: any) => setDraft(evt?.value ?? evt?.detail?.value ?? "")}
        />
        <Image src="/common/dmpage_sendbtn.png" className="ml-2 h-8 w-8" onClick={send} />
      </View>
    </PageShell>
  );
}

function parseContent(raw: string): string {
  if (!raw) return "";
  try {
    const obj = JSON.parse(raw);
    return obj?.content ?? raw;
  } catch {
    return raw;
  }
}
