// src/hooks/SoundProvider.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

const SoundContext = createContext(null);
export const useSoundManager = () => useContext(SoundContext);

function createAudio(src) {
  const a = new Audio(src);
  a.preload = "auto";
  a.loop = false;
  a.volume = 1;
  return a;
}

export const SoundProvider = ({ children }) => {
  // key -> { src, audio, baseVolume }
  const registryRef = useRef({});
  const currentBgmKeyRef = useRef(null);

  // ブラウザの自動再生制限アンロック
  const unlockedRef = useRef(false);
  const pendingBgmRef = useRef(null); // { key, options }

  // ---------- サウンド登録 ----------
  const loadSounds = (soundMap) => {
    if (!soundMap || typeof soundMap !== "object") return;
    const reg = registryRef.current;
    for (const [key, value] of Object.entries(soundMap)) {
      const src = typeof value === "string" ? value : value?.src;
      const baseVolume =
        typeof value === "object" && typeof value.volume === "number"
          ? value.volume
          : 1;
      if (!src) continue;

      // 既に登録済みならスキップ
      if (reg[key]?.src === src) continue;

      const audio = createAudio(src);
      audio.volume = baseVolume;

      reg[key] = { src, audio, baseVolume };
    }
  };

  // ---------- アンロック処理 ----------
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;

      // 無音再生→停止（モバイルのポリシー解除）
      Object.values(registryRef.current).forEach(({ audio }) => {
        try {
          const wasMuted = audio.muted;
          audio.muted = true;
          audio.play().catch(() => {});
          setTimeout(() => {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch {}
            audio.muted = wasMuted;
          }, 0);
        } catch {}
      });

      // アンロック前に要求があったBGMを再生
      if (pendingBgmRef.current) {
        const { key, options } = pendingBgmRef.current;
        pendingBgmRef.current = null;
        internalPlayBgm(key, options);
      }
    };

    // pointerdown/keydown のいずれでも解除
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  // ---------- 停止 ----------
  const stopSound = (key) => {
    const reg = registryRef.current;
    if (key) {
      const entry = reg[key];
      if (!entry) return;
      try {
        entry.audio.pause();
        entry.audio.currentTime = 0;
      } catch {}
      if (currentBgmKeyRef.current === key) {
        currentBgmKeyRef.current = null;
      }
      return;
    }

    // key 省略時は現在の BGM を止める
    if (currentBgmKeyRef.current) {
      const k = currentBgmKeyRef.current;
      currentBgmKeyRef.current = null;
      const a = reg[k]?.audio;
      try {
        a?.pause();
        if (a) a.currentTime = 0;
      } catch {}
    }
  };

  const stopAll = () => {
    Object.keys(registryRef.current).forEach((k) => stopSound(k));
  };

  // ---------- 再生（内部：BGM） ----------
  const internalPlayBgm = (key, options = {}) => {
    const reg = registryRef.current;
    const entry = reg[key];
    if (!entry) {
      console.warn(`❌ BGM "${key}" は未登録です。loadSounds() を確認してください。`);
      return;
    }

    // 前のBGMを停止
    if (currentBgmKeyRef.current && currentBgmKeyRef.current !== key) {
      stopSound(currentBgmKeyRef.current);
    }
    currentBgmKeyRef.current = key;

    const a = entry.audio;
    a.loop = options.loop ?? true; // BGMは基本ループ
    a.volume =
      typeof options.volume === "number" ? options.volume : entry.baseVolume ?? 1;

    // 現在時刻をリセットしてから再生
    try {
      a.currentTime = 0;
      a.play().catch((e) => {
        // ここに来るのは、まだアンロックされていない等
        // （アンロック後に pendingBgm を拾うので握りつぶす）
        console.debug("BGM play deferred:", e?.message ?? e);
      });
    } catch (e) {
      console.debug("BGM play error:", e?.message ?? e);
    }
  };

  // ---------- 再生（公開API） ----------
  const playSound = (key, options = {}) => {
    const reg = registryRef.current;
    let entry = reg[key];

    if (!entry) {
      console.warn(
        `❌ サウンド "${key}" は未登録です。先に loadSounds({ ${key}: "/path/file.mp3" }) を呼んでください。`
      );
      return;
    }

    const isBgm =
      options.loop === true || String(key).toLowerCase().startsWith("bgm");

    if (isBgm) {
      // アンロック前はキューしておく
      if (!unlockedRef.current) {
        pendingBgmRef.current = { key, options };
        console.debug(`🔇 BGM "${key}" はアンロック後に再生されます。`);
        return;
      }
      internalPlayBgm(key, options);
      return;
    }

    // 効果音（SFX）: cloneNodeで多重発音に強くする
    try {
      const base = entry.audio;
      const node = base.cloneNode(); // 同じsrcで別インスタンス
      node.volume =
        typeof options.volume === "number" ? options.volume : entry.baseVolume ?? 1;
      node.play().catch((e) => {
        console.debug(`SFX "${key}" 再生に失敗:`, e?.message ?? e);
      });
    } catch (e) {
      console.debug(`SFX "${key}" エラー:`, e?.message ?? e);
    }
  };

  const value = useMemo(
    () => ({
      loadSounds,
      playSound,
      stopSound,
      stopAll,
      unlocked: unlockedRef.current,
    }),
    []
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};
