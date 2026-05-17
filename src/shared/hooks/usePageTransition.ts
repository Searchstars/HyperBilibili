import { useEffect, useState } from "@astralsight/astroforge-core";

export type TransitionState = "entering" | "active" | "leaving";

/**
 * 进出页过渡 className。
 *
 * 旧版 ui.ts vmPool 在 onShow / onHide 切换 class。新版用本 hook：
 *   - mount 后立刻从 "entering" → "active"（驱动入场动画）
 *   - 调用 setLeaving(true) 切到 "leaving"（驱动出场动画）
 *
 * 与 tailwind.css 里 @keyframes slide-in-up / slide-out-down 对齐。
 */
export function usePageTransition(): {
  className: string;
  setLeaving: (v: boolean) => void;
} {
  const [state, setState] = useState<TransitionState>("entering");

  useEffect(() => {
    const t = setTimeout(() => setState("active"), 16);
    return () => clearTimeout(t);
  }, []);

  const setLeaving = (v: boolean) => {
    if (v) setState("leaving");
  };

  let className: string;
  switch (state) {
    case "entering":
      className = "opacity-0";
      break;
    case "active":
      className = "animate-fade-in";
      break;
    case "leaving":
      className = "animate-fade-out";
      break;
  }

  return { className, setLeaving };
}
