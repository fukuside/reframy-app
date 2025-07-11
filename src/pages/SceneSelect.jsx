import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ← ✅ useNavigate を含める
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager"; // ← これが必要！
import "../style.css";

export default function SceneSelect() {
  const { playSound } = useSoundManager();
  const navigate = useNavigate(); // ✅ これを追加！
  useBgmManager(); // ✅ BGM（bgm_home）を自動再生

  // ✅ 初回クリックでBGM再生許可を取得（自動再生ブロック対策）
  useEffect(() => {
    const unlockAudio = () => {
      playSound("bgm_home", { loop: true, volume: 0.4 });
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click",unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
    };
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

      <div className="button-container">
        <div
  onClick={() => {
    playSound("tap");
    navigate("/select", { state: { from: "home" } }); // ← ✅ これでBGM切替成功
  }}
  style={{ cursor: "pointer" }}
>
  <img
    src="/images/lets_try_button.png"
    alt="レッツトライ"
    className="animated-button"
  />
</div>

      <div onClick={() => {
          playSound("tap");
          navigate("/about",{ state: { from: "home" } }); // ✅ 明示的に指定
        }}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/images/point_button_yellow.png"
            alt="ポイント説明を見る"
            className="animated-button"
            style={{ width: "180px", cursor: "pointer" }}
          />
        </div>  
      </div>

      <footer style={{ marginTop: "3rem", fontSize: "1.0rem", color: "#555" }}>
        一般社団法人福祉でつながる会
      </footer>
    </main>
  );
}


