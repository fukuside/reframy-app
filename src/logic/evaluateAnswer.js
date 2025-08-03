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
      advice: "",
      matchedPositive: [],
      matchedNegative: [],
      matchedMust: [],
      missedMust: []
    };
  }

  const normalizedInput = normalize(input);
  const { positive_keywords = [], negative_keywords = [], must_include = [], advice = "" } = evaluation;

  const matchedNegative = negative_keywords.filter(word =>
    normalizedInput.includes(normalize(word))
  );
  const matchedPositive = positive_keywords.filter(word =>
    normalizedInput.includes(normalize(word))
  );
  const matchedMust = must_include.filter(word =>
    normalizedInput.includes(normalize(word))
  );
  const missedMust = must_include.filter(word =>
    !normalizedInput.includes(normalize(word))
  );

  const hasNegative = matchedNegative.length > 0;
  const hasPositive = matchedPositive.length > 0;
  const mustThreshold = Math.max(1, Math.ceil(must_include.length * 0.15));
  const meetsMust = matchedMust.length >= mustThreshold;

  let resultMessage = "";
  if (hasNegative && !hasPositive) {
    resultMessage = "😟 ネガティブな発言が含まれます。自分の伝えたい思いは分かったけど、相手はどう思うのか？と考えた工夫は必要。";
  } else if (hasNegative && hasPositive) {
    resultMessage = "⚖️ 前向きな言葉もあって良い。しかし、少し強すぎる表現があるかも。ネガティブとポジティブが入り混じることで、相手にネガティブな印象のみ与えやすくなってしまいます💦";
  } else if (!hasNegative && !meetsMust) {
    resultMessage = "🤔 柔軟な発想が必要です。たくさん練習しましょう。";
  } else if (matchedPositive.length >= 3) {
    resultMessage = "😊✨ ポジティブが複数含まれています。実戦で活用していけますね。あなたの声かけ素敵です。";
  } else if (matchedPositive.length > 0) {
    resultMessage = "😊 ポジティブな声掛けができています。あなたの声掛けとても良いです！";
  } else {
    resultMessage = "🤔 柔軟な発想が必要です。たくさん練習しましょう。";
  }

  return {
    result: resultMessage,
    advice,
    matchedPositive,
    matchedNegative,
    matchedMust,
    missedMust
  };
}
