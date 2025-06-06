import React from "react";
import { useNavigate } from "react-router-dom";
import scenes from "../data/scenes.js";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager"; // ✅ 追加
import "../style.css";

export default function SceneListPage() {
  useBgmManager(); // ✅ BGM を再生（/select → bgm_list）
  const { playSound } = useSoundManager(); // ✅ 修正（useBgmManagerではない）
  const navigate = useNavigate();

  // ✅ 効果音付き + state付き遷移
  const handleLinkClick = (id) => {
    playSound("tap");
    navigate(`/input/${id}`, {
      state: { from: "story" }, // ✅ BGMの条件に使える（任意）
    });
  };

  return (
    <div className="container">
      <h2>シーン一覧</h2>
      <div className="scene-grid">
        {scenes.map((scene) => (
          <div key={scene.id} className="scene-wrapper">
            <div
              className="scene-card"
              onClick={() => handleLinkClick(scene.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={scene.image}
                alt={scene.title}
                className="scene-image small"
              />
              <div className="scene-title">{scene.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          className="button"
          onClick={() => {
            playSound("tap");
            navigate("/");
          }}
        >
          ← トップへ戻る
        </button>
      </div>
    </div>
  );
}