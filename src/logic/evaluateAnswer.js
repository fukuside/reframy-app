// src/logic/evaluateAnswer.js

/**
 * 入力文字列を正規化する関数
 * - 小文字化
 * - 記号や句読点、空白の削除
 * - 全角英数の半角化（簡易）
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[。、,.！？!?「」『』（）()【】\[\]\s]/g, "")
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    )
    .trim();
}

/**
 * 声かけを評価するメイン関数
 * @param {string} input - ユーザーの声かけ
 * @param {object} evaluation - 該当質問の評価ルール
 * @returns {object} 評価コメントとアドバイス
 */
export function evaluateAnswer(input, evaluation) {
  if (!input || !evaluation) {
    return {
      result: "評価できませんでした。",
      advice: ""
    };
  }

  const normalizedInput = normalize(input);
  const { positive_keywords = [], negative_keywords = [], must_include = [], advice = "" } = evaluation;

  // 1. ネガティブワードチェック
  const containsNegative = negative_keywords.some(word =>
    normalizedInput.includes(normalize(word))
  );
  if (containsNegative) {
    return {
      result: "ネガティブな表現が含まれています。",
      advice
    };
  }

  // 2. must_include をより柔軟に判定（部分語ベース）
  const mustWordsMatched = must_include.filter(word =>
    normalizedInput.includes(normalize(word))
  );

  const mustThreshold = Math.max(1, Math.ceil(must_include.length * 0.25)); // ← 25% 8語中 → 2語一致でOKになる

  if (mustWordsMatched.length < mustThreshold) {
    return {
      result: "大事な視点が足りないようです。",
      advice
    };
  }

  // 3. ポジティブワードチェック（1語でも含まれれば良し）
  const containsPositive = positive_keywords.some(word =>
    normalizedInput.includes(normalize(word))
  );

  if (containsPositive) {
    return {
      result: "あなたの声掛けとても素敵です！",
      advice: ""
    };
  }

  // 4. 基本の評価
  return {
    result: "良いんだけど、もう少しポジティブな言葉を入れてみましょう。",
    advice
  };
}