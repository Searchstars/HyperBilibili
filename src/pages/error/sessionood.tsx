import { router } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import ErrorView from "../../shared/ui/ErrorView";

export default function SessionOod() {
  return (
    <PageShell>
      <ErrorView
        message="登录已过期，请重新扫码登录"
        retryLabel="去登录"
        onRetry={() => {
          router.clear();
          router.replace({ uri: "pages/app/entry/login" });
        }}
      />
    </PageShell>
  );
}
