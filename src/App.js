import React, { useEffect, useState } from "react"; 
import { Routes, Route } from "react-router-dom";
import { SoundProvider, useSoundManager } from "./hooks/SoundProvider";

import SceneSelect from "./pages/SceneSelect";
import Evaluation from "./pages/Evaluation";
import UserInput from "./pages/UserInput";
import SceneListPage from "./pages/SceneListPage";
import RuleAdmin from "./pages/RuleAdmin"; // 管理画面
import About from "./pages/About"; // 追加説明画面ルート
import Glossary from "./pages/Glossary"; // 用語説明ルート

import FeedbackWidget from "./components/FeedbackWidget"; // ✅ フィードバックフォーム追加

function AppContent() {
  const { loadSounds } = useSoundManager();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadSounds({
      tap: process.env.PUBLIC_URL + "/sounds/tap.mp3",
      fukidasi: process.env.PUBLIC_URL + "/sounds/fukidasi.mp3",
      bgm_home: process.env.PUBLIC_URL + "/sounds/bgm_home.mp3",
      bgm_solo: process.env.PUBLIC_URL + "/sounds/bgm_solo.mp3",
      bgm_end: process.env.PUBLIC_URL + "/sounds/bgm_end.mp3",
    });

    const hasSeen = localStorage.getItem("hasSeenNewFeature");
    if (!hasSeen) {
      setShowPopup(true);
      localStorage.setItem("hasSeenNewFeature", "true");
    }
  }, [loadSounds]);

  return (
    <>
      <Routes>
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/" element={<SceneSelect />} />
        <Route path="/select" element={<SceneListPage />} />
        <Route path="/input/:id" element={<UserInput />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/admin/rules" element={<RuleAdmin />} />
        <Route path="/about" element={<About />} /> {/* ✅ 追加 */}
      </Routes>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>新機能のお知らせ</h3>
          <p>新しい問題が追加されました！「NEW」ラベルをチェックしてください。</p>
          <button onClick={() => setShowPopup(false)} style={{ marginTop: "12px", padding: "8px" }}>
            閉じる
          </button>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
}
