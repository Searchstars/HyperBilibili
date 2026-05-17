import { Image, Text, View } from "@astralsight/astroforge-core";
import PageShell from "../../../../shared/ui/PageShell";
import TitleBar from "../../../../shared/ui/TitleBar";
import { buildinfo } from "../../../../shared/util/buildinfo";

export default function About() {
  return (
    <PageShell>
      <TitleBar title="关于" />
      <View className="flex flex-1 flex-col items-center justify-center">
        <Image src="/common/logo96.png" className="h-20 w-20" />
        <Text className="mt-3 text-base text-white">澎湃哔哩</Text>
        <Text className="mt-1 text-xs text-gray-400">v{buildinfo.versionName} ({buildinfo.gitCommit})</Text>
        <Text className="mt-1 text-xs text-gray-500">{buildinfo.gitBranch}</Text>
        <Text className="mt-4 text-xs text-gray-400">基于 AstroForge 工具链</Text>
      </View>
    </PageShell>
  );
}
