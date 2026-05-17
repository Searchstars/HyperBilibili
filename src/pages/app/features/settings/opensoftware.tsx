import { Scroll, Text, View } from "@astralsight/astroforge-core";
import PageShell from "../../../../shared/ui/PageShell";
import TitleBar from "../../../../shared/ui/TitleBar";

// 当前实际依赖仅 tailwindcss / AstroForge / rsbuild；这里给一份精简清单。
const LICENSES: Array<{ name: string; license: string }> = [
  { name: "AstroForge", license: "MIT" },
  { name: "Tailwind CSS", license: "MIT" },
  { name: "Rsbuild", license: "MIT" },
];

export default function OpenSoftware() {
  return (
    <PageShell>
      <TitleBar title="开源软件" />
      <Scroll className="flex-1 w-full" scrollY={true}>
        <View className="px-3 py-2">
          {LICENSES.map((lic) => (
            <View key={lic.name} className="flex flex-row items-center justify-between py-2">
              <Text className="text-sm text-white">{lic.name}</Text>
              <Text className="text-xs text-gray-400">{lic.license}</Text>
            </View>
          ))}
        </View>
      </Scroll>
    </PageShell>
  );
}
