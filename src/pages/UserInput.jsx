// src/pages/UserInput.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SpeechInput from "../components/SpeechInput";
import scenes from "../data/scenes";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import evaluateAnswer from "../logic/evaluateAnswer";
import "../style.css";

const ICONS = { positive: "✅", negative: "⚠️", must: "📎", hint: "💡" };

// 安全に数を決めるユーティリティ
function safeCount(primaryNum, secondaryNum, matchedArray) {
  if (Number.isFinite(primaryNum)) return primaryNum;
  if (Number.isFinite(secondaryNum)) return secondaryNum;
  if (Array.isArray(matchedArray)) return matchedArray.length;
  return 0;
}

export default function UserInput() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const soundMgr = useSoundManager();
  const playSound = soundMgr?.playSound; // 存在しなくてもエラーにしない
  useBgmManager();

  // 正本からシーン取得
  const scene = useMemo(
    () => scenes.find((s) => String(s.id) === String(id)) ?? null,
    [id]
  );

  // ロールプレイ（再挑戦）かどうか
  const isRetry = Boolean(location.state?.retryMode);

  // 入力状態
  const [responses, setResponses] = useState([]);
  const [tempResponse, setTempResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // 画面切替で初期化
  useEffect(() => {
    setResponses([]);
    setTempResponse("");
    setCurrentIndex(0);
  }, [scene?.id, location.key]);

  // 質問と現在の質問
  const questions = Array.isArray(scene?.questions) ? scene.questions : [];
  const currentQuestion = questions[currentIndex] ?? null;

  const hasInput = (tempResponse ?? "").trim().length > 0;

  // リアルタイム評価
  const realtimeResult = useMemo(() => {
    if (!currentQuestion?.evaluation) return null;
    return evaluateAnswer(tempResponse ?? "", currentQuestion.evaluation);
  }, [tempResponse, currentQuestion]);

  // 本番：ロールプレイ時のみ表示
  const shouldShow = isRetry && hasInput && !!realtimeResult;

  // マッチ配列を取り出し
  const matchedPositive = Array.isArray(realtimeResult?.matchedPositive)
    ? realtimeResult.matchedPositive
    : [];
  const matchedNegative = Array.isArray(realtimeResult?.matchedNegative)
    ? realtimeResult.matchedNegative
    : [];
  const matchedMust = Array.isArray(realtimeResult?.matchedMust)
    ? realtimeResult.matchedMust
    : [];
  const missedMust = Array.isArray(realtimeResult?.missedMust)
    ? realtimeResult.missedMust
    : [];

  // ✅ ここが今回の肝：NaNで止まらないフォールバック
  const pos = safeCount(
    realtimeResult?.positiveCount,
    realtimeResult?.pos,
    matchedPositive
  );
  const neg = safeCount(
    realtimeResult?.negativeCount,
    realtimeResult?.neg,
    matchedNegative
  );
  const must = safeCount(
    realtimeResult?.mustCount,
    realtimeResult?.must,
    matchedMust
  );

  // 入力/音声
  const handleChange = (e) => setTempResponse(e.target.value);
  const handleSpeechResult = (text) =>
    setTempResponse((prev) => (prev ?? "") + text);

  // 次へ
  const handleNext = () => {
    try { playSound && playSound("tap"); } catch {}
    const newResponses = [
      ...responses,
      {
        questionId: currentQuestion?.id ?? `q${currentIndex}`,
        userResponse: tempResponse,
      },
    ];
    setResponses(newResponses);
    setTempResponse("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate("/evaluation", { state: { scene, responses: newResponses } });
    }
  };

  const ok = !!scene && questions.length > 0;

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      {!ok ? (
        <div>質問が見つかりません。</div>
      ) : (
        <>
          <h2>{scene.title}</h2>
          <img
            src={scene.image}
            alt={scene.title}
            className="scene-image"
            style={{ maxWidth: "40%" }}
          />
          <p>状況：{scene.situation}</p>
          <div className="bubble">こども「{currentQuestion?.child}」</div>

          <textarea
            className="response-box"
            value={tempResponse}
            onChange={handleChange}
            placeholder="あなたの声かけを入力してください"
            rows={4}
          />

          <div style={{ marginTop: "1rem" }}>
            <SpeechInput onResult={handleSpeechResult} />
          </div>

          {shouldShow && (
            <div
              key={`${scene?.id ?? "s"}-${currentIndex}-on`}
              className="helper-eval-box"
              style={{
                marginTop: "16px",
                padding: "16px",
                border: "2px dashed #c7d2fe",
                borderRadius: "12px",
                background: "#f8fafc",
              }}
            >
              <p style={{ marginBottom: 8 }}>📊 <strong>とりあえず評価</strong></p>
              <p style={{ margin: "6px 0" }}>
                <span aria-hidden>{ICONS.positive}</span> ポジティブワード: {pos}
              </p>
              <p style={{ margin: "6px 0" }}>
                <span aria-hidden>{ICONS.negative}</span> ネガティブワード: {neg}
              </p>
              <p style={{ margin: "6px 0" }}>
                <span aria-hidden>{ICONS.must}</span> 必須ワード（must_include）: {must}
              </p>

              {missedMust.length > 0 && (
                <p
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "#f5f7ff",
                    color: "#374151",
                    display: "inline-block",
                  }}
                >
                  <span aria-hidden>{ICONS.hint}</span>
                  <strong style={{ margin: "0 4px" }}>気づきのヒント:</strong>
                  {missedMust.join("、")}
                </p>
              )}

              <p style={{ marginTop: 10 }}>
                <span role="img" aria-label="comment">🗒</span>{" "}
                評価コメント: {realtimeResult?.result}
              </p>
            </div>
          )}

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button className="btn" onClick={handleNext}>次へ</button>
          </div>
        </>
      )}
    </div>
  );
}
