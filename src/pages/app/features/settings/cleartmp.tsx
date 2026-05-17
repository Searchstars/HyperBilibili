import { Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../../shared/ui/PageShell";
import TitleBar from "../../../../shared/ui/TitleBar";
import Button from "../../../../shared/ui/Button";
import { computeSavedTotalKB } from "../../../../shared/util/savedcontent";
import { fileRmdir } from "../../../../shared/util/file";
import { invalidate } from "../../../../shared/api/cache";

export default function ClearTmp() {
  const [size, setSize] = useState(0);
  const [status, setStatus] = useState("");

  const refresh = async () => {
    setSize(await computeSavedTotalKB());
  };

  useEffect(() => {
    refresh();
  }, []);

  const onClear = async () => {
    invalidate();
    await fileRmdir("internal://files/logs/");
    await refresh();
    setStatus("已清理");
  };

  return (
    <PageShell>
      <TitleBar title="清理缓存" />
      <View className="flex flex-1 flex-col items-center justify-center">
        <Text className="text-sm text-white">当前占用：{size} KB</Text>
        <View className="mt-4">
          <Button label="立即清理" onClick={onClear} />
        </View>
        {status ? <Text className="mt-3 text-xs text-gray-400">{status}</Text> : null}
      </View>
    </PageShell>
  );
}
