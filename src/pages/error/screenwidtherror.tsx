import PageShell from "../../shared/ui/PageShell";
import ErrorView from "../../shared/ui/ErrorView";

export default function ScreenWidthError() {
  return (
    <PageShell>
      <ErrorView message="当前屏幕过小或过大，可能不能完整显示界面。" />
    </PageShell>
  );
}
