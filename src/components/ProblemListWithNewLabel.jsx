import React, { useEffect, useState } from "react";

const problems = [
  { id: 1, title: "問題A", createdAt: "2025-07-25" },
  { id: 2, title: "問題B", createdAt: "2025-08-01" }, // NEW
  { id: 3, title: "問題C", createdAt: "2025-07-15" },
];

const isNew = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 10;
};

export default function ProblemListWithNewLabel() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenNewFeature");
    if (!hasSeen) {
      setShowPopup(true);
      localStorage.setItem("hasSeenNewFeature", "true");
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>問題一覧</h2>
      <ul>
        {problems.map((p) => (
          <li key={p.id} style={{ marginBottom: "10px" }}>
            {p.title}
            {isNew(p.createdAt) && (
              <span
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  marginLeft: "8px",
                  fontSize: "12px",
                }}
              >
                NEW
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* ポップアップ */}
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
    </div>
  );
}
