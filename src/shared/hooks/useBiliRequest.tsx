// 占位说明：AstroForge 当前不会把自定义 hook 的内部 useState/useEffect 静态
// 展开到调用方页面。因此真正的 "useBiliRequest" 抽象暂时不可行。
//
// 在页面里直接组合：
//   const [data, setData] = useState<T | undefined>(undefined);
//   const [err, setErr]   = useState<string | undefined>(undefined);
//   useEffect(() => {
//     loader().then(setData).catch((e) => setErr(String(e)));
//   }, []);
//
// 为了避免空文件被 import，导出一个无副作用常量。

export const useBiliRequestPlaceholder = true;
