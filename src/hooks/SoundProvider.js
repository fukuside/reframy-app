import React, { createContext, useContext, useEffect, useRef } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const soundsRef = useRef({});
  const currentBgmRef = useRef(null);
  const autoplayUnlocked = useRef(false); // 🔓 初回ユーザー操作フラグ

  // 🔊 初回クリックで autoplay を許可
  useEffect(() => {
    const unlock = () => {
      autoplayUnlocked.current = true;
      console.log("✅ ユーザー操作で音声再生が許可されました");
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("click", unlock);
    return () => document.removeEventListener("click", unlock);
  }, []);

  // 🔃 サウンド一覧を登録
  const loadSounds = (soundMap) => {
    soundsRef.current = soundMap;
  };

  // 🔊 音声再生
  const playSound = (key, options = {}) => {
    const path = soundsRef.current[key];
    if (!path) {
      console.warn(`❌ サウンド "${key}" が登録されていません。`);
      return;
    }

    console.log("🔊 再生要求:", key, "→", path);

    const audio = new Audio(path);
    audio.volume = options.volume ?? 1.0;

    if (options.loop) {
      audio.loop = true;

      if (!autoplayUnlocked.current) {
        console.warn(`🔇 "${key}" の再生はユーザー操作後に許可されます`);
        return;
      }

      if (currentBgmRef.current) {
        currentBgmRef.current.pause();
      }

      currentBgmRef.current = audio;

      audio.play().catch((e) => {
        console.warn(`🎵 "${key}" の BGM再生に失敗:`, e);
      });

      return;
    }

    // 効果音（単発）
    audio.play().catch((e) => {
      console.warn(`🎵 "${key}" の効果音再生に失敗:`, e);
    });
  };

  // 🛑 音声停止
  const stopSound = () => {
    if (currentBgmRef.current) {
      currentBgmRef.current.pause();
      currentBgmRef.current = null;
    }
  };

  return (
    <SoundContext.Provider value={{ loadSounds, playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundManager = () => useContext(SoundContext);