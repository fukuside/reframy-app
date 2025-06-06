import React, { useEffect, useState } from "react";

export default function RuleAdmin() {
  const [rules, setRules] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/rules")
      .then((res) => res.json())
      .then((data) => setRules(data))
      .catch(() => setStatus("読み込みに失敗しました"));
  }, []);

  const handleSubmit = async () => {
    const newRule = {
      keywords: keywords.split(",").map(k => k.trim()),
      comment
    };

    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRule),
    });

    if (res.ok) {
      const updated = await res.json();
      setRules(updated);
      setKeywords("");
      setComment("");
      setStatus("保存しました");
    } else {
      setStatus("保存に失敗しました");
    }
  };

  return (
    <div className="container">
      <h2>評価ルール管理</h2>

      <h3>既存ルール</h3>
      <ul>
        {rules.map((r, i) => (
          <li key={i}>
            <strong>{r.keywords.join(", ")}</strong> → {r.comment}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <h3>新しいルールを追加</h3>
        <input
          type="text"
          placeholder="キーワード（カンマ区切り）"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <br />
        <textarea
          placeholder="評価コメント"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button onClick={handleSubmit}>追加して保存</button>
        <p>{status}</p>
      </div>
    </div>
  );
}
