import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSoundManager } from "./SoundProvider";

export default function useBgmManager() {
  const { playSound, stopSound } = useSoundManager();
  const location = useLocation();
  const currentBgm = useRef("");

  useEffect(() => {
    const path = location.pathname;
    const from = location.state?.from??"null";
    let bgmKey = "";

    if (path === "/") {
      bgmKey = "bgm_home";       // トップページ
    } else if (path.startsWith("/select")) {
      bgmKey = "bgm_solo";       // シーン一覧
    } else if (path.startsWith("/input")) {
      bgmKey = "bgm_solo";       // 声かけ入力
    } else if (path.startsWith("/evaluation")) {
      bgmKey = "bgm_end";        // 評価画面
     } else if (path.startsWith("/about")) {
     // 🔽 from=home の場合は BGM 継続、stop せずにそのまま
      if (from === "home") {
        console.log("✅ /about: BGM維持 (from: home)");
        return; // ❗ useEffect の残りをスキップ（stop もしない）
      } else {
        bgmKey = "bgm_home";
      }
    }
    // 変更なしなら再生不要
    if (!bgmKey || currentBgm.current === bgmKey) return;

    console.log("🎵 BGM切り替え:", currentBgm.current, "→", bgmKey);

     // ⚠️ stopSound を少し遅らせる（安定性向上）
  setTimeout(() => {
    stopSound();
    playSound(bgmKey, { loop: true,volume: 0.4 });
    currentBgm.current = bgmKey;
}, 100); // ← 小さな遅延を挟むと競合回避できることあり
    return () => {
      stopSound();
    };
  }, [location.pathname, location.state?.from]);
}
