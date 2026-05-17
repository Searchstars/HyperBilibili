import { Image, Input, Text, View, router, useState } from "@astralsight/astroforge-core";

interface Props {
  placeholder?: string;
  initial?: string;
  /** 提交完成后回调；返回前等回调可异步进行。 */
  onConfirm?: (text: string) => void;
}

// 旧版 FullScreenInput 借助一个全屏弹层 + 自定义键盘；新版直接用 Vela 的
// <input type="text">，让设备调用系统输入法（圆屏小键盘）。
export default function FullScreenInput({ placeholder, initial, onConfirm }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (onConfirm) onConfirm(value);
    router.back();
  };

  return (
    <View className="flex h-full w-full flex-col bg-black">
      <View className="flex h-12 flex-row items-center justify-between px-3">
        <View className="flex h-8 w-8 items-center justify-center" onClick={() => router.back()}>
          <Image src="/common/textinput_back.png" className="h-6 w-6" />
        </View>
        <Text className="text-base text-white">{placeholder ?? "输入"}</Text>
        <View className="flex h-8 w-8 items-center justify-center" onClick={submit}>
          <Image src="/common/textinput_finish.png" className="h-6 w-6" />
        </View>
      </View>
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        className="mx-3 mt-3 h-10 rounded-md bg-gray-800 px-3 text-sm text-white"
        onChange={(evt: any) => setValue(evt?.value ?? evt?.detail?.value ?? "")}
      />
    </View>
  );
}
