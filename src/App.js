// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/SceneSelect";
import SceneListPage from "./pages/SceneListPage";
import UserInput from "./pages/UserInput";
import Evaluation from "./pages/Evaluation";
import About from "./pages/About";
import Glossary from "./pages/Glossary";

import { useSoundManager } from "./hooks/SoundProvider";
import useBgmManager from "./hooks/useBgmManager"; // 追加

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

// 追加：BGM管理を起動するだけのコンポーネント
function BgmBoot() {
  useBgmManager();
  return null;
}

export default function App() {
  return (
    <>
      <SoundBoot />
      <BgmBoot />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<SceneListPage />} />
        <Route path="/input/:id" element={<UserInput />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/about" element={<About />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}