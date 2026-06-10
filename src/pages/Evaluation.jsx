// src/pages/Evaluation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import evaluateAnswer from "../logic/evaluateAnswer";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import "../style.css";

// 回答例の表現ゆれを作るための補助文。
// ここはAI APIではなく、既存UIを壊さず試すための軽量版です。
const SOFT_OPENERS = [
  "そう感じたんだね。",
  "まずは気持ちを聞かせてくれてありがとう。",
  "今はそういう気分なんだね。",
  "なるほど、そう思ったんだね。",
];

const NEXT_ACTIONS = [
  "どうしたら少しやりやすくなるか、一緒に考えよう。",
  "今できそうなことを一つだけ選んでみようか。",
  "少し休んでから、できるところから始めてみよう。",
  "あなたの気持ちを大事にしながら、次の一歩を考えよう。",
];

const AVOID_NEGATIVE_NOTE = "責める言い方より、気持ちを受け止める言葉から始めると伝わりやすくなります。";
const MISSED_MUST_NOTE = "大事な視点を一つ足すと、より安心感のある声かけになります。";

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function compactText(text, maxLength = 90) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}…`;
}

function buildExampleOptions({ example, advice, matchedNegative, missedMust }) {
  const options = [];

  if (example) options.push(compactText(example, 120));

  const openers = shuffleArray(SOFT_OPENERS).slice(0, 2);
  const actions = shuffleArray(NEXT_ACTIONS).slice(0, 2);

  openers.forEach((opener, index) => {
    options.push(compactText(`${opener}${actions[index] || actions[0]}`, 120));
  });

  if (Array.isArray(matchedNegative) && matchedNegative.length > 0) {
    options.push(AVOID_NEGATIVE_NOTE);
  }

  if (Array.isArray(missedMust) && missedMust.length > 0) {
    options.push(`${MISSED_MUST_NOTE} 例：「${missedMust[0]}」を入れてみましょう。`);
  }

  if (advice) options.push(compactText(advice, 120));

  // 重複を消し、最大4件までに制限してUI崩れを防ぐ
  return [...new Set(options)].slice(0, 4);
}

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
  const [exampleIndex, setExampleIndex] = useState({});

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
        const exampleOptions = buildExampleOptions({
          example: question.example || "",
          advice: evalResult.advice || "",
          matchedNegative: evalResult.matchedNegative || [],
          missedMust: evalResult.missedMust || [],
        });

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
          exampleOptions,
        };
      })
      .filter(Boolean);

    setResults(resultList);
    setLoading(false);
  }, [scene, responses]);

  const toggleExample = (qid) => {
    playSound("fukidasi");
    setShowExamples((prev) => ({ ...prev, [qid]: !prev[qid] }));
    setExampleIndex((prev) => ({ ...prev, [qid]: prev[qid] ?? 0 }));
  };

  const nextExample = (qid, optionLength) => {
    playSound("fukidasi");
    setExampleIndex((prev) => ({
      ...prev,
      [qid]: ((prev[qid] ?? 0) + 1) % Math.max(optionLength, 1),
    }));
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
        results.map((r) => {
          const options = Array.isArray(r.exampleOptions) && r.exampleOptions.length > 0
            ? r.exampleOptions
            : ["例は登録されていません。"];
          const currentExample = options[exampleIndex[r.questionId] ?? 0] || options[0];

          return (
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
                  例：{currentExample}
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <button className="btn" onClick={() => toggleExample(r.questionId)}>
                  回答例を見る
                </button>
                {showExamples[r.questionId] && options.length > 1 && (
                  <button
                    className="btn"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => nextExample(r.questionId, options.length)}
                  >
                    別の言い方
                  </button>
                )}
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
          );
        })
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
