import { evaluateAnswer } from "../logic/evaluateAnswer";
import scenes from "../data/scenes"; // 念のため評価元も
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import "../style.css";

export default function Evaluation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playSound } = useSoundManager();
  useBgmManager(); // ✅ BGM を再生（bgm_story）

  const scene = location.state?.scene;
  const responses = location.state?.responses || [];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExamples, setShowExamples] = useState({});
  const [showAdvice, setShowAdvice] = useState({});

  useEffect(() => {
  const evaluateLocally = () => {
    setLoading(true);
    try {
      const resultList = responses.map((res) => {
        const question = scene.questions.find((q) => q.id === res.questionId);
        const evalResult = evaluateAnswer(res.userResponse, question.evaluation);
        return {
          questionId: res.questionId,
          childUtterance: question.child,
          userResponse: res.userResponse,
          comment: evalResult.result,
          advice: evalResult.advice
        };
      });

      setResults(resultList);
    } catch (err) {
      console.error("ローカル評価エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  if (scene && responses.length > 0) {
    evaluateLocally();
  }
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

  if (!scene) return <div className="container">評価対象が見つかりません。</div>;

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <h2>{scene.title} の評価</h2>
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
          <div key={r.questionId} style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
            <p className="bubble">こども「{r.childUtterance}」</p>
            <p>あなたの声かけ：「{r.userResponse}」</p>
            <p style={{ color: "green" }}>評価コメント：{r.comment}</p>

            {/* 回答例 */}
            {showExamples[r.questionId] && (
              <div className="example-bubble" style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
                例：{scene.questions.find(q => q.id === r.questionId)?.example || "例は登録されていません。"}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button className="btn" onClick={() => toggleExample(r.questionId)}>
                回答例を見る
              </button>
            </div>

            {/* アドバイス */}
            <div className="advice-wrapper" style={{ marginTop: "1rem" }}>
              <img src="/images/advisor.png" alt="アドバイザー" className="advisor-image" />
              {showAdvice[r.questionId] && (
                <div className="advice-bubble">
                  {scene.questions.find(q => q.id === r.questionId)?.advice || "アドバイスは準備中です。"}
                </div>
              )}
            </div>
            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button className="btn" onClick={() => toggleAdvice(r.questionId)}>
                💡 ワンポイントアドバイス
              </button>
            </div>
          </div>
        ))
      )}

      {/* ナビゲーション */}
      <div style={{ marginTop: "3rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={() => handleClick("/")}>トップへ戻る</button>
        <button className="btn" onClick={() => handleClick("/select")}>一覧へ戻る</button>
      </div>
    </div>
  );
}
