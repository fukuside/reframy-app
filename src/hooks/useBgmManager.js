import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSoundManager } from "./SoundProvider";

const SWITCH_DELAY_MS = 60;

export default function useBgmManager() {
  const sound = useSoundManager() || {};
  const location = useLocation();
  const currentKeyRef = useRef("");

  const pickBgmKey = (path, from) => {
    if (path === "/") return "bgm_home";
    if (path.startsWith("/select")) return "bgm_solo";
    if (path.startsWith("/input")) return "bgm_solo";
    if (path.startsWith("/evaluation")) return "bgm_end";
    if (path.startsWith("/about")) {
      if (from === "home") return null; // ← ホームからの About はBGM維持
      return "bgm_home";
    }
    return "bgm_home";
  };

  useEffect(() => {
    const path = location.pathname || "/";
    const from = location.state?.from || null;
    const nextKey = pickBgmKey(path, from);

    if (nextKey === null) return;                 // 維持
    if (!nextKey || nextKey === currentKeyRef.current) return;

    const t = setTimeout(() => {
      sound.stopSound?.();
      sound.playSound?.(nextKey, { loop: true, volume: 0.4 });
      currentKeyRef.current = nextKey;
    }, SWITCH_DELAY_MS);

    return () => clearTimeout(t);
  }, [location.key]);
}
