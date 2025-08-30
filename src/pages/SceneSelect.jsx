// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import FeedbackWidget from "../components/FeedbackWidget";
import "../style.css";

export default function Home() {
  const { playSound } = useSoundManager();
  const navigate = useNavigate();

  // BGM 切替（ホームなら bgm_home）
  useBgmManager();

  // 初回クリックで BGM を許可＆再生
  useEffect(() => {
    const unlockAudio = () => {
      playSound?.("bgm_home", { loop: true, volume: 0.4 });
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, [playSound]);

  return (
    <main className="container" style={{ padding: "2rem" }}>
      <img src="/images/logo.png" alt="Reframyロゴ" className="logo" />
      <h1 className="title">Reframyへようこそ！</h1>
      <p className="subtitle">
        ネガティブな発言をポジティブに言い換える<br />
        「リフレーミング力」を育てるトレーニングアプリ
      </p>
      <p className="subtitle">～さあ、リフレーミングを体験して一緒に思考を変えて行動を変えよう～</p>

      <div className="button-container" style={{ position: "relative", zIndex: 2 }}>
        <div
          onClick={() => {
            playSound?.("tap");
            // ← ここで必ず /select（シーン一覧）へ遷移
            navigate("/select", { state: { from: "home" } });
          }}
          style={{ cursor: "pointer" }}
          aria-label="レッツトライ"
        >
          <img src="/images/lets_try_button.png" alt="レッツトライ" className="animated-button" />
        </div>

        <div
          onClick={() => {
            playSound?.("tap");
            navigate("/about", { state: { from: "home" } });
          }}
          style={{ cursor: "pointer" }}
          aria-label="ポイント説明を見る"
        >
          <img
            src="/images/point_button_yellow.png"
            alt="ポイント説明を見る"
            className="animated-button"
            style={{ width: 180 }}
          />
        </div>
      </div>

      <footer style={{ marginTop: "3rem", fontSize: "1.0rem", color: "#555" }}>
        一般社団法人福祉でつながる会
      </footer>

      {/* フィードバック吹き出し（トップのみでOK） */}
      <FeedbackWidget />
    </main>
  );
}
