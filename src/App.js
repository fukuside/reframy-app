// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/SceneSelect";                 // ← トップ（今のHome.jsx）
import SceneListPage from "./pages/SceneListPage"; // ← 問題選択ページ
import UserInput from "./pages/UserInput";
import Evaluation from "./pages/Evaluation";
import About from "./pages/About";
import Glossary from "./pages/Glossary";

import { useSoundManager } from "./hooks/SoundProvider";

// 起動時に一度だけサウンドを登録
function SoundBoot() {
  const { loadSounds } = useSoundManager() || {};
  useEffect(() => {
    loadSounds?.({
      tap: "/sounds/tap.mp3",
      fukidasi: "/sounds/fukidasi.mp3",
      bgm_home: "/sounds/bgm_home.mp3",
      bgm_solo: "/sounds/bgm_solo.mp3",
      bgm_end: "/sounds/bgm_end.mp3",
    });
  }, [loadSounds]);
  return null;
}

export default function App() {
  return (
    <>
      <SoundBoot />
      <Routes>
        {/* トップ（ホーム） */}
        <Route path="/" element={<Home />} />

        {/* 問題選択ページ */}
        <Route path="/select" element={<SceneListPage />} />

        {/* シーン入力／評価 */}
        <Route path="/input/:id" element={<UserInput />} />
        <Route path="/evaluation" element={<Evaluation />} />

        {/* ポイント解説／用語集 */}
        <Route path="/about" element={<About />} />
        <Route path="/glossary" element={<Glossary />} />

        {/* 不明URLはトップへ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
