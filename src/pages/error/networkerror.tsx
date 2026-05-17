import { router } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import ErrorView from "../../shared/ui/ErrorView";

export default function NetworkError() {
  return (
    <PageShell>
      <ErrorView message="网络异常，请检查蓝牙/WiFi 连接" retryLabel="重试" onRetry={() => router.back()} />
    </PageShell>
  );
}
