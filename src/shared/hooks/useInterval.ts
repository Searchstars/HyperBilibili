import { useEffect, useRef } from "@astralsight/astroforge-core";

/**
 * 等价 React 经典 useInterval：callback 用 ref 锁住，间隔可变，delay=null 停。
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => cbRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useTimeout(callback: () => void, delay: number | null): void {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => cbRef.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}
