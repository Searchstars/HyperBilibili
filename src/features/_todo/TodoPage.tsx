import { router, Text, View } from "@astralsight/astroforge-core";
import { Button } from "@shared/ui/Button";
import { PageShell } from "@shared/ui/PageShell";

/**
 * 占位页面 —— Phase 5+ 才会落地的路由先用这个 stub 顶住，避免 router.replace
 * 跳过去就 404。每页用 `makeTodoPage(name)` 包一层，把页名渲染出来。
 */
export function makeTodoPage(name: string) {
  return function TodoPage() {
    return (
      <PageShell title={name} showBack>
        <View
          className="flex-col items-center justify-center w-full"
          style={{ marginTop: "60px" }}
        >
          <Text
            className="text-white"
            style={{ fontSize: "26px", fontWeight: "600" }}
          >
            页面待迁移：{name}
          </Text>
          <Text
            className="text-white"
            style={{
              fontSize: "18px",
              marginTop: "10px",
              width: "80%",
              textAlign: "center",
            }}
          >
            此页面属于 Phase 5+ 工作范围，当前 Phase 1–4 已落地脚手架 / API /
            shared UI / entry 全套。
          </Text>
          <Button
            text="返回"
            marginTop="25px"
            primary
            onClick={() => {
              try {
                router.back();
              } catch {
                router.replace({ uri: "pages/app/arealist" });
              }
            }}
          />
        </View>
      </PageShell>
    );
  };
}

export const todoLifecycle = {
  onInit() {
    console.log("[todo] onInit");
  },
};
