// src/pages/Evaluation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import evaluateAnswer from "../logic/evaluateAnswer";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import "../style.css";

export default function Evaluation() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ フックは無条件に呼ぶ（ルール・オブ・フック対応）
  const soundMgr = useSoundManager();
  const playSound = soundMgr?.playSound ?? (() => {});
  useBgmManager();

  const scene = location.state?.scene;
  const responses = location.state?.responses || [];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState({});
  const [showAdvice, setShowAdvice] = useState({});

  useEffect(() => {
    if (!scene || !scene.questions || responses.length === 0) {
      setLoading(false);
      return;
    }

    const resultList = responses
      .map((res) => {
        const question = scene.questions.find((q) => q.id === res.questionId);
        if (!question) return null;

        const evalResult = evaluateAnswer(res.userResponse, question.evaluation);

        return {
          questionId: res.questionId,
          childUtterance: question.child,
          userResponse: res.userResponse,
          comment: evalResult.result,
          advice: evalResult.advice,
          matchedPositive: evalResult.matchedPositive || [],
          matchedNegative: evalResult.matchedNegative || [],
          matchedMust: evalResult.matchedMust || [],
          missedMust: evalResult.missedMust || [],
          example: question.example || "",
        };
      })
      .filter(Boolean);

    setResults(resultList);
    setLoading(false);
  }, [scene, responses]);

  const toggleExample = (qid) => {
    playSound("fukidasi");
    setShowExamples((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const toggleAdvice = (qid) => {
    playSound("fukidasi");
    setShowAdvice((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  const handleClick = (path) => {
    playSound("tap");
    navigate(path);
  };

  if (!scene) {
    return <div className="container">⚠️ 評価対象が見つかりません。</div>;
  }

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <h2>📝 {scene.title} の評価</h2>
      <img
        src={scene.image}
        alt={scene.title}
        className="scene-image"
        style={{ maxWidth: "40%", borderRadius: "16px" }}
      />
      <div className="bubble">状況：{scene.situation}</div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>評価中...</p>
      ) : (
        results.map((r) => (
          <div
            key={r.questionId}
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ccc",
              paddingTop: "1rem",
            }}
          >
            <p className="bubble">こども「{r.childUtterance}」</p>
            <p>🗣 あなたの声かけ：「{r.userResponse}」</p>
            <p style={{ color: "green" }}>📋 評価コメント：{r.comment}</p>

            <div className="keyword-match">
              {r.matchedPositive.length > 0 && (
                <p>🌟 ポジティブワード: {r.matchedPositive.join("、")}</p>
              )}
              {r.matchedNegative.length > 0 && (
                <p>⚠️ ネガティブワード: {r.matchedNegative.join("、")}</p>
              )}
              {r.matchedMust.length > 0 && (
                <p>✅ 大事な視点: {r.matchedMust.join("、")}</p>
              )}
              {r.missedMust.length > 0 && (
                <p>💡欠けていた視点: {r.missedMust.join("、")}</p>
              )}
            </div>

            {showExamples[r.questionId] && (
              <div
                className="example-bubble"
                style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}
              >
                例：{r.example || "例は登録されていません。"}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button className="btn" onClick={() => toggleExample(r.questionId)}>
                回答例を見る
              </button>
            </div>

            <div
              className="advice-wrapper"
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src="/images/advisor.png" alt="アドバイザー" className="advisor-image" />
              {showAdvice[r.questionId] && (
                <div className="advice-bubble" style={{ textAlign: "left", maxWidth: "80%" }}>
                  {r.advice || "アドバイスは準備中です。"}
                </div>
              )}
              <div style={{ marginTop: "0.5rem" }}>
                <button className="btn" onClick={() => toggleAdvice(r.questionId)}>
                  💡 ワンポイントアドバイス
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
  className="btn"
  onClick={() => {
    try { playSound && playSound("tap"); } catch {}
    navigate(`/input/${scene.id}`, { state: { retryMode: true } });
  }}
>
  🔁 もう一度ロールプレイに挑戦
</button>
        <button className="btn" onClick={() => handleClick("/")}>トップへ戻る</button>
        <button className="btn" onClick={() => handleClick("/select")}>一覧へ戻る</button>
      </div>
    </div>
  );
}
