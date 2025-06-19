import React, { useEffect } from "react"; 
import { Routes, Route } from "react-router-dom";
import { SoundProvider, useSoundManager } from "./hooks/SoundProvider";

import SceneSelect from "./pages/SceneSelect";
import Evaluation from "./pages/Evaluation";
import UserInput from "./pages/UserInput";
import SceneListPage from "./pages/SceneListPage";
import RuleAdmin from "./pages/RuleAdmin"; // 管理画面
import About from "./pages/About"; // 追加説明画面ルート
import Glossary from "./pages/Glossary"; // 用語説明ルート

function AppContent() {
  const { loadSounds } = useSoundManager();

  useEffect(() => {
    loadSounds({
      tap: process.env.PUBLIC_URL + "/sounds/tap.mp3",
      fukidasi: process.env.PUBLIC_URL + "/sounds/fukidasi.mp3",
      bgm_home: process.env.PUBLIC_URL + "/sounds/bgm_home.mp3",
      bgm_solo: process.env.PUBLIC_URL + "/sounds/bgm_solo.mp3",
      bgm_end: process.env.PUBLIC_URL + "/sounds/bgm_end.mp3",
    });
  }, [loadSounds]);

  return (
    <Routes>
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/" element={<SceneSelect />} />
      <Route path="/select" element={<SceneListPage />} />
      <Route path="/input/:id" element={<UserInput />} />
      <Route path="/evaluation/:id" element={<Evaluation />} />
      <Route path="/admin/rules" element={<RuleAdmin />} />
      <Route path="/about" element={<About />} /> {/* ✅ 追加 */}
    </Routes>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
}
