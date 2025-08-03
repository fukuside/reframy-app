import React from "react"; 
import { useNavigate } from "react-router-dom";
import scenes from "../data/scenes.js";
import { useSoundManager } from "../hooks/SoundProvider";
import useBgmManager from "../hooks/useBgmManager";
import "../style.css";

export default function SceneListPage() {
  useBgmManager();
  const { playSound } = useSoundManager();
  const navigate = useNavigate();

  const categorizedScenes = scenes.reduce((acc, scene) => {
    if (!acc[scene.category]) acc[scene.category] = [];
    acc[scene.category].push(scene);
    return acc;
  }, {});

  const handleLinkClick = (id) => {
    playSound("tap");
    navigate(`/input/${id}`, {
      state: { from: "story" },
    });
  };

  const isNew = (createdAt) => {
    if (!createdAt) return false;
    const now = new Date();
    const created = new Date(createdAt);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 10;
  };

  return (
    <div className="container">
      <h2 className="title">シーン一覧</h2>

      {Object.entries(categorizedScenes).map(([category, sceneList]) => (
        <div key={category} className="category-block">
          <h3 className="category-title">🧩 {category}</h3>
          <div className="category-grid">
            {sceneList.map((scene) => (
              <div key={scene.id} className="scene-card" onClick={() => handleLinkClick(scene.id)}>
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="scene-image small"
                />
                <div className="scene-title">
                  {scene.title}
                  {isNew(scene.createdAt) && (
                    <span
                      style={{
                        backgroundColor: 'orange',
                        color: 'white',
                        fontSize: '10px',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        marginLeft: '6px'
                      }}
                    >NEW</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

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
