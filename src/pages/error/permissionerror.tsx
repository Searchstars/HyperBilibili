import PageShell from "../../shared/ui/PageShell";
import ErrorView from "../../shared/ui/ErrorView";

export default function PermissionError() {
  return (
    <PageShell>
      <ErrorView message="缺少必要权限。请在系统设置中允许设备识别码与文件访问。" />
    </PageShell>
  );
}
