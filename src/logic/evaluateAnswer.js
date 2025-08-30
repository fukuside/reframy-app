// src/logic/evaluateAnswer.js
import synonymMap from "./synonyms";

/* ---------- helpers ---------- */
function stripSentenceTail(s = "") {
  return s.replace(/(かな|かも|だよね|だよ|だね|よね|よ|ね|な|さ)+$/g, "");
}
function normalize(text = "") {
  if (typeof text !== "string") text = String(text ?? "");
  const toHalf = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  );
  const removed = toHalf
    .toLowerCase()
    .replace(
      /[ \t\r\n\u3000。、．，・/／!！\?？;；:："'“”‘’`（）\(\)\[\]【】『』《》〈〉…—―ｰ\-~]/g,
      ""
    )
    .trim();
  return stripSentenceTail(removed);
}
function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") return Object.values(v);
  if (v == null) return [];
  return [v];
}
function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

/** 既存のシノニム展開（positive/negative向け） */
function expandWithSynonyms(kw) {
  const list = synonymMap?.[kw] ?? [];
  return uniq([kw, ...(Array.isArray(list) ? list : [])]);
}

/** must向けの“緩和”つき展開（汎用ヒューリスティックを追加） */
function expandMustVariants(kw) {
  const base = expandWithSynonyms(kw);

  const add = [];

  const key = String(kw);
  const has = (pat) => new RegExp(pat).test(key);

  // 汎用「理由の確認」「把握」「確認」系
  if (has("理由|わけ|原因|把握|確認")) {
    add.push(
      "どうしたの", "どうして", "なんで", "なぜ", "理由", "わけ",
      "教えて", "話してくれる", "聞かせて", "どこが嫌", "どこが難しい"
    );
  }

  // 共感・寄り添い
  if (has("共感|寄り添い|気持ち")) {
    add.push("そっか", "そうだよね", "わかるよ", "つらかったね", "嫌だったね");
  }

  // 安心
  if (has("安心")) {
    add.push("大丈夫", "安心して", "そばにいる", "一緒にいる", "落ち着いていこう");
  }

  // 区切り・切替
  if (has("区切り|切り替え|切替")) {
    add.push("一回おしまい", "あと5分", "次のタイミング", "区切りつけよう");
  }

  // 見通し・楽しみ
  if (has("楽しみ|見通し|見とおし")) {
    add.push("終わったら", "あとで楽しみ", "次にしよう", "楽しみにしよう");
  }

  // 自主性・工夫
  if (has("自主性|工夫|自分のペース|自分で")) {
    add.push("自分のペースで", "無理しなくていい", "やりやすい方法で", "自分でやってみよう");
  }

  return uniq([...base, ...add]);
}

function includesAnyVariant(variants, textN) {
  return variants.some((v) => {
    const k = normalize(v);
    return k.length > 0 && textN.includes(k);
  });
}
function pickExamplesFor(missedKeys = []) {
  const ex = [];
  for (const key of missedKeys) {
    const v = synonymMap?.[key];
    if (Array.isArray(v) && v.length) {
      ex.push(`「${v[0]}」`);
      if (ex.length >= 2) break;
    }
  }
  return ex;
}

/* ---------- main ---------- */
export default function evaluateAnswer(input, evaluation) {
  if (!evaluation) {
    const empty = {
      result: "評価ルールが見つかりません。",
      advice: "",
      matchedPositive: [],
      matchedNegative: [],
      matchedMust: [],
      missedMust: [],
      positiveCount: 0,
      negativeCount: 0,
      mustCount: 0,
      pos: 0,
      neg: 0,
      must: 0,
    };
    if (typeof window !== "undefined") window.__EVAL_LAST__ = empty;
    return empty;
  }

  // どの形式でも配列化
  const positives = asArray(evaluation.positive_keywords ?? evaluation.positiveKeywords);
  const negatives = asArray(evaluation.negative_keywords ?? evaluation.negativeKeywords);
  const musts     = asArray(evaluation.must_include   ?? evaluation.mustInclude);
  const advice    = evaluation.advice ?? "";

  const textN = normalize(String(input ?? ""));

  // ヒット抽出
  const matchedPositive = positives.filter((kw) => includesAnyVariant(expandWithSynonyms(kw), textN));
  const matchedNegative = negatives.filter((kw) => includesAnyVariant(expandWithSynonyms(kw), textN));

  // must は緩和展開を使う
  const matchedMust = musts.filter((kw) => includesAnyVariant(expandMustVariants(kw), textN));
  const missedMust  = musts.filter((kw) => !includesAnyVariant(expandMustVariants(kw), textN));

  const posCount  = matchedPositive.length;
  const negCount  = matchedNegative.length;
  const mustCount = matchedMust.length;

  // 必須達成の敷居（最低1件）。必要なら 0.1〜0.2 で微調整してください
  const mustThreshold = Math.max(1, Math.ceil(musts.length * 0.15));
  const meetsMust     = mustCount >= mustThreshold;

  const hasNegative = negCount > 0;
  const hasPositive = posCount > 0;

  let resultMessage = "";
  if (hasNegative && !hasPositive) {
    resultMessage =
      "😟 ネガティブな発言が含まれます。自分の伝えたい思いは分かったけど、相手はどう思うのか？と考えた工夫は必要。";
  } else if (hasNegative && hasPositive) {
    resultMessage =
      "⚖️ 前向きな言葉もあって良い。ただ、少し強すぎる表現が混ざっています。優しい言い回しに置き換えてみましょう。";
  } else if (hasPositive && !meetsMust) {
    const ex = pickExamplesFor(missedMust);
    resultMessage =
      "😊 ポジティブな声掛けができています。さらに " +
      (missedMust.length ? missedMust.join("、") : "必須視点") +
      " を入れるとより良くなります。" +
      (ex.length ? ` 例：${ex.join("、")}` : "");
  } else if (posCount >= 3) {
    resultMessage =
      "😊✨ ポジティブが複数含まれています。実戦で活用していけますね。あなたの声かけ素敵です。";
  } else if (posCount > 0) {
    resultMessage = "😊 ポジティブな声掛けができています。とても良いです！";
  } else {
    resultMessage = "🤔 柔軟な発想が必要です。たくさん練習しましょう。";
  }

  const out = {
    result: resultMessage,
    advice,
    matchedPositive,
    matchedNegative,
    matchedMust,
    missedMust,
    positiveCount: posCount,
    negativeCount: negCount,
    mustCount: mustCount,
    pos: posCount,
    neg: negCount,
    must: mustCount,
    textN,
  };
  if (typeof window !== "undefined") {
    window.__EVAL_LAST__ = { input, evaluation, ...out };
  }
  return out;
}
