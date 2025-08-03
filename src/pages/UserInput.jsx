import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SpeechInput from "../components/SpeechInput";
import scenes from "../data/scenes";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import { evaluateAnswer } from "../logic/evaluateAnswer";
import "../style.css";

export default function InputPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSound } = useSoundManager();
  useBgmManager(); // BGM再生

  const scene = location.state?.scene || scenes.find((s) => s.id === parseInt(id));
  const isRetry = location.state?.retryMode || false;

  const [responses, setResponses] = useState([]);
  const [tempResponse, setTempResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [realtimeResult, setRealtimeResult] = useState(null);

  useEffect(() => {
    if (isRetry) {
      setResponses([]); // リトライ時はクリア
    }
  }, [isRetry]);

  if (!scene || !scene.questions || scene.questions.length === 0) {
    return <div className="container">質問が見つかりません。</div>;
  }

  const currentQuestion = scene.questions[currentIndex];

  const handleChange = (e) => {
    const value = e.target.value;
    setTempResponse(value);

    if (isRetry) {
      const result = evaluateAnswer(value, currentQuestion.evaluation);
      setRealtimeResult(result);
    }
  };

  const handleNext = () => {
    playSound("tap");
    const newResponses = [
      ...responses,
      {
        questionId: currentQuestion.id,
        userResponse: tempResponse,
      },
    ];
    setResponses(newResponses);
    setTempResponse("");
    setRealtimeResult(null);

    if (currentIndex + 1 < scene.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/evaluation", {
  state: {
    scene: scene,         // ← 確実に渡す
    responses: newResponses, // ← 回答一覧も確実に渡す
  },
});
    }
  };

  const handleSpeechResult = (text) => {
    setTempResponse((prev) => {
      const updated = prev + text;

      if (isRetry) {
        const result = evaluateAnswer(updated, currentQuestion.evaluation);
        setRealtimeResult(result);
      }

      return updated;
    });
  };

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <h2>{scene.title}</h2>
      <img
        src={scene.image}
        alt={scene.title}
        className="scene-image"
        style={{ maxWidth: "40%" }}
      />
      <p>状況：{scene.situation}</p>
      <div className="bubble">こども「{currentQuestion.child}」</div>

      <textarea
        className="response-box"
        value={tempResponse}
        onChange={handleChange}
        placeholder="あなたの声かけを入力してください"
        rows={4}
      />

      {/* 🎤 音声入力ボタン */}
      <div style={{ marginTop: "1rem" }}>
        <SpeechInput onResult={handleSpeechResult} />
      </div>

      {/* ✨ リトライ時のみ補助評価を表示 */}
      {isRetry && realtimeResult && (
  <div className="helper-eval-box">
    <p>📊 <strong>リアルタイム評価</strong></p>
    <p>✅ ポジティブワード: {realtimeResult.matchedPositive?.length || 0}</p>
    <p>⚠️ ネガティブワード: {realtimeResult.matchedNegative?.length || 0}</p>
    <p>📝 必須ワード（must_include）: {realtimeResult.matchedMust?.length || 0}</p>
    <p>🗣 評価コメント: {realtimeResult.result}</p>
  </div>
)}
      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button className="btn" onClick={handleNext}>次へ</button>
      </div>
    </div>
  );
}
