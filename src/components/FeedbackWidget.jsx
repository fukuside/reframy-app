import React, { useState } from "react";
import { Paperclip, MessageCircle } from "lucide-react";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("バグ報告");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(`フィードバック: ${feedbackType}`);
    const body = encodeURIComponent(`内容:\n${content}\n\nメール: ${email}`);
    window.location.href = `mailto:info.fukushi@allcare.co.jp?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          right: "80px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fffbe6",
          padding: "8px 12px",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <img
          src="/images/advisor.png"
          alt="アドバイザー"
          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "8px" }}
        />
        <span style={{ fontSize: "14px" }}>フィードバックはこちら</span>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          padding: "12px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
        aria-label="フィードバックを送る"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            width: "300px",
            zIndex: 1000,
          }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: "10px" }}>フィードバックを送信</h3>

              <label>フィードバック種別</label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <option>バグ報告</option>
                <option>要望</option>
                <option>その他</option>
              </select>

              <label>内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ width: "100%", height: "80px", marginBottom: "10px" }}
              />

              <label>スクリーンショット（任意）</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
                style={{ marginBottom: "10px" }}
              />

              <label>メールアドレス（任意）</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <button type="submit" style={{ width: "100%", padding: "8px" }}>
                送信
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ width: "100%", padding: "8px", marginTop: "8px" }}
              >
                閉じる
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>ありがとうございます！</p>
              <button onClick={() => setIsOpen(false)} style={{ padding: "8px", marginTop: "10px" }}>
                閉じる
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
