import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSoundManager } from "../hooks/SoundProvider";
import "../style.css";

export default function About() {
  const navigate = useNavigate();
  const { playSound } = useSoundManager();

  useEffect(() => {
    const unlock = () => {
    // ✅ 明示的に再生
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
      <h2>ポイント説明（仮）</h2>
      <p>
        ※ここに後で説明文が入ります。
        <br />
        たとえば、リフレーミングとは何か、どう使うのかなど…
      </p>

      <button
        className="button"
        style={{ marginTop: "2rem" }}
        onClick={() => {
          playSound("tap");
          navigate("/");
        }}
      >
        ← トップページに戻る
      </button>
    </div>
  );
}
