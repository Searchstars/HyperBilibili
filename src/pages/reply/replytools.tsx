import { Image, Input, Text, View, router, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import Button from "../../shared/ui/Button";
import { sendReply } from "../../shared/api/comment";

interface Route {
  params?: { type?: string; oid?: string };
}

// 发评论。系统输入法填字 + "发送" 调接口。
export default function ReplyTools(props: Route) {
  const type = props?.params?.type ?? "1";
  const oid = props?.params?.oid ?? "";
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {
    if (!text) {
      setStatus("内容不能为空");
      return;
    }
    try {
      const resp = await sendReply(type, oid, text);
      if (resp?.code === 0) {
        setStatus("已发送");
        setTimeout(() => router.back(), 600);
      } else {
        setStatus(resp?.message ?? "发送失败");
      }
    } catch {
      setStatus("网络错误");
    }
  };

  return (
    <PageShell>
      <TitleBar title="发评论" />
      <View className="flex flex-1 flex-col px-3">
        <Input
          type="text"
          value={text}
          placeholder="说点什么"
          className="mt-3 h-24 rounded-md bg-gray-800 px-3 text-sm text-white"
          onChange={(evt: any) => setText(evt?.value ?? evt?.detail?.value ?? "")}
        />
        <View className="mt-3 flex flex-row items-center justify-center">
          <Button label="发送" onClick={submit} />
        </View>
        {status ? <Text className="mt-3 text-center text-xs text-gray-400">{status}</Text> : null}
      </View>
    </PageShell>
  );
}
