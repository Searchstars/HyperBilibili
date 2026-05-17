import { Image, Text, View } from "@astralsight/astroforge-core";
import PageShell from "../../../../shared/ui/PageShell";
import TitleBar from "../../../../shared/ui/TitleBar";

export default function Donation() {
  return (
    <PageShell>
      <TitleBar title="支持开发者" />
      <View className="flex flex-1 flex-col items-center justify-center">
        <Image src="/common/donation.png" className="h-16 w-16" />
        <Text className="mt-3 px-6 text-center text-sm text-white">如果觉得本应用有用，欢迎到官网 hyperbili.astralsight.space 支持。</Text>
      </View>
    </PageShell>
  );
}
