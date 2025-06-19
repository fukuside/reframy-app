import React from "react";
import { useNavigate } from "react-router-dom";
import { useSoundManager } from "../hooks/SoundProvider";
import "../style.css";

export default function Glossary() {
  const navigate = useNavigate();
  const { playSound } = useSoundManager();

  const goBack = () => {
    playSound("tap");
    navigate(-1);
  };

  return (
    <div
      className="container"
      style={{
        padding: "2rem",
        backgroundColor: "#f9f9f9", // ← 明るい背景
        minHeight: "100vh"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📝 用語説明</h2>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "1.5rem",
          lineHeight: "1.8em",
          fontSize: "1rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <p>
          <strong>リフレーミング：</strong>
          ものごとの見方をポジティブに捉えなおすこと。/たとえば「失敗した」を「チャレンジした証」と言い替えるような力。
        </p>
        <p>
          <strong>共感：</strong>
          子どもの気持ちに「わかるよ」「そう思ったんだね」と寄り添う姿勢。安心感の第一歩です。
        </p>
        <p>
          <strong>声かけ：</strong>
          子どもにかける言葉。タイミングや言い方次第で、自己肯定感や信頼関係に大きく影響します。
        </p>
        <p>
          <strong>ポジティブ言語：</strong>
          「できる」「たのしみ」など、前向きで安心感のある言葉づかいを指します。
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button className="button" onClick={goBack}>
          ← 前の画面に戻る
        </button>
      </div>
    </div>
  );
}
