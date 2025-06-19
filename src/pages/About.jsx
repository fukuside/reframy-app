import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSoundManager } from "../hooks/SoundProvider";
import pointsText from "../data/points"; // ⬅ ポイント説明テキストを読み込み
import "../style.css";
import { Link } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const { playSound } = useSoundManager();

  useEffect(() => {
    const unlock = () => {
      playSound("bgm_home", { loop: true, volume: 0.4 });
      document.removeEventListener("click", unlock);
    };

    document.addEventListener("click", unlock);

    return () => {
      document.removeEventListener("click", unlock);
    };
  }, [playSound]);

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>📘 ポイント説明</h2>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
          padding: "1.5rem",
          whiteSpace: "pre-wrap",
          lineHeight: "1.8em",
          fontSize: "1rem"
        }}
      >
        {pointsText}
      </div>

 　　 <p>
 　　 用語の解説は <Link to="/glossary">こちらのページ</Link> にまとめています。
　　　</p>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          className="button"
          onClick={() => {
            playSound("tap");
            navigate("/");
          }}
        >
          ← トップページに戻る
        </button>
      </div>
    </div>
  );
}
