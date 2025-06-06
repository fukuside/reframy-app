import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import scenes from "../data/scenes.js";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import "../style.css";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export default function UserInput() {
  useBgmManager(); // ✅ BGM 自動管理

  const { id } = useParams();
  const navigate = useNavigate();
  const { playSound } = useSoundManager();
  const scene = scenes.find((s) => s.id === Number(id));
  const [inputs, setInputs] = useState({});

  const handleSubmit = () => {
    const responses = scene.questions.map((q) => ({
      questionId: q.id,
      childUtterance: q.child,
      userResponse: inputs[q.id] || "",
    }));

    playSound("tap");

    navigate(`/evaluation/${id}`, {
      state: {
        scene,
        responses,
        from: "story", // ✅ ← BGM判定に必要！
      },
    });
  };

  const handleVoiceInput = (questionId) => {
    playSound("tap");

    if (!recognition) {
      alert("このブラウザは音声認識に対応していません。");
      return;
    }

    recognition.lang = "ja-JP";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputs((prev) => ({
        ...prev,
        [questionId]: (prev[questionId] || "") + transcript,
      }));
    };

    recognition.onerror = (event) => {
      alert("音声入力エラー: " + event.error);
    };
  };

  if (!scene) {
    return <div className="container">シーンが見つかりません。</div>;
  }

  return (
    <div className="container">
      <h2>{scene.title}</h2>
      <img
        src={scene.image}
        alt={scene.title}
        className="scene-image"
        style={{ maxWidth: "40%", borderRadius: "16px" }}
      />
      <div className="bubble">状況：{scene.situation}</div>

      {scene.questions.map((q) => (
        <div key={q.id} style={{ marginTop: "2rem" }}>
          <div className="bubble">こども「{q.child}」</div>
          <textarea
            value={inputs[q.id] || ""}
            onChange={(e) => setInputs({ ...inputs, [q.id]: e.target.value })}
            placeholder="あなたの声かけを入力してください"
            rows={3}
            style={{
              width: "80%",
              padding: "1rem",
              fontSize: "1rem",
              borderRadius: "12px",
              marginTop: "1rem",
              backgroundColor: "#fffbe8",
              border: "2px solid #ccc",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <button className="btn" onClick={() => handleVoiceInput(q.id)}>
              🎤 音声入力
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: "2rem" }}>
        <button className="btn" onClick={handleSubmit}>
          評価へ進む
        </button>
      </div>
    </div>
  );
}
