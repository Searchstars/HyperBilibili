import { Text, View } from "@astralsight/astroforge-core";
import type { JSX } from "@astralsight/astroforge-core";
import type { UseBiliRequestResult } from "../hooks/useBiliRequest";
import { Loading } from "./Loading";
import { ErrorView } from "./ErrorView";

export interface DataViewProps<T> {
  state: UseBiliRequestResult<T>;
  /** 判定是否"空"的回调；默认 (data) => !data 或长度为 0 */
  isEmpty?: (data: T) => boolean;
  emptyText?: string;
  /** 渲染数据 */
  children: (data: T) => JSX.Element | null;
  /** 自定义 loading；不传则用默认 Loading 组件 */
  loadingNode?: JSX.Element;
}

function defaultEmpty<T>(data: T): boolean {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  return false;
}

export function DataView<T>({
  state,
  isEmpty = defaultEmpty,
  emptyText = "暂无数据",
  children,
  loadingNode,
}: DataViewProps<T>) {
  if (state.loading && state.data == null) {
    return (
      <View className="flex-col items-center justify-center" style={{ marginTop: "30px" }}>
        {loadingNode ?? <Loading />}
      </View>
    );
  }
  if (state.error && state.data == null) {
    return (
      <ErrorView
        title="加载失败"
        message={String((state.error as any)?.message ?? state.error)}
        onRetry={() => void state.refresh()}
      />
    );
  }
  if (state.data == null || isEmpty(state.data)) {
    return (
      <View className="flex-col items-center justify-center" style={{ marginTop: "30px" }}>
        <Text className="text-[24px] text-white">{emptyText}</Text>
      </View>
    );
  }
  return children(state.data);
}
