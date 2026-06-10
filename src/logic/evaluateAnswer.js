// src/logic/evaluateAnswer.js
import synonymMap from "./synonyms";

/* ---------- helpers ---------- */
function stripSentenceTail(s = "") {
  return s.replace(/(かな|かも|だよね|だよ|だね|よね|よ|ね|な|さ)+$/g, "");
}

function normalize(text = "") {
  if (typeof text !== "string") text = String(text ?? "");
  const toHalf = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
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

function expandWithSynonyms(kw) {
  const list = synonymMap?.[kw] ?? [];
  return uniq([kw, ...(Array.isArray(list) ? list : [])]);
}

function includesAny(words, textN) {
  return words.some((word) => {
    const k = normalize(word);
    return k.length > 0 && textN.includes(k);
  });
}

function makeMatcher(words) {
  return (textN) => includesAny(words, textN);
}

/* ---------- 共通評価軸 ---------- */
const AXES = [
  {
    key: "empathy",
    label: "気持ちの受け止め",
    weight: 2,
    words: [
      "そっか",
      "そうだね",
      "そうなんだ",
      "わかる",
      "わかった",
      "気持ちわかる",
      "嫌だよね",
      "いやだよね",
      "つらいね",
      "しんどいね",
      "大変だったね",
      "疲れたね",
      "疲れたんだね",
      "眠いね",
      "悲しかったね",
      "悔しかったね",
      "不安だよね",
      "怖かったね",
      "びっくりしたね",
      "頑張ったね",
      "頑張ってるね",
    ],
  },
  {
    key: "proposal",
    label: "具体的な提案",
    weight: 2,
    words: [
      "休憩",
      "休んでから",
      "少し休んで",
      "ちょっと休憩",
      "一休み",
      "ひと休み",
      "あとで",
      "後で",
      "一緒に",
      "一緒にやろう",
      "一緒に考えよう",
      "手伝う",
      "手伝おうか",
      "分けて",
      "少しずつ",
      "まず",
      "ここから",
      "できるところから",
      "終わったら",
      "タイマー",
      "5分",
      "ごふん",
    ],
  },
  {
    key: "choice",
    label: "選択肢・自主性",
    weight: 2,
    words: [
      "どっち",
      "どれ",
      "どうしたい",
      "どうする",
      "どこから",
      "何から",
      "選んで",
      "選べる",
      "自分で",
      "自分のペース",
      "やりやすい",
      "できそう",
      "ならできる",
      "決めていい",
      "決めよう",
      "無理しなくていい",
      "あとにする",
      "先にする",
    ],
  },
  {
    key: "reason",
    label: "理由の確認",
    weight: 1,
    words: [
      "どうしたの",
      "どうして",
      "なんで",
      "なぜ",
      "理由",
      "わけ",
      "教えて",
      "聞かせて",
      "話して",
      "どこが嫌",
      "どこが難しい",
      "何が嫌",
      "何が難しい",
    ],
  },
  {
    key: "reassurance",
    label: "安心感",
    weight: 1,
    words: [
      "大丈夫",
      "安心して",
      "そばにいる",
      "一緒にいる",
      "大丈夫だよ",
      "ゆっくり",
      "落ち着いて",
      "心配しなくていい",
    ],
  },
];

const NEGATIVE_PATTERNS = [
  "だめ",
  "ダメ",
  "駄目",
  "早く",
  "はやく",
  "急いで",
  "やりなさい",
  "しなさい",
  "しろ",
  "やれ",
  "ちゃんとしなさい",
  "いい加減",
  "なんでできない",
  "また",
  "普通は",
  "みんなできる",
  "置いていく",
  "知らない",
  "勝手にして",
  "怒るよ",
  "泣かない",
  "泣くな",
  "うるさい",
  "わがまま",
  "怠け",
  "甘え",
  "約束でしょ",
  "もう知らない",
];

const STRONG_NEGATIVE_PATTERNS = [
  "しろ",
  "やれ",
  "置いていく",
  "もう知らない",
  "勝手にして",
  "怒るよ",
  "なんでできない",
  "うるさい",
  "わがまま",
];

function buildSceneKeywordMatches(keywords, textN, expander = expandWithSynonyms) {
  return keywords.filter((kw) => includesAny(expander(kw), textN));
}

function expandMustVariants(kw) {
  const base = expandWithSynonyms(kw);
  const key = String(kw);
  const add = [];
  const has = (pat) => new RegExp(pat).test(key);

  // 共通評価軸の語彙も must 判定の補助に使う
  for (const axis of AXES) {
    if (has(axis.label) || has(axis.key)) add.push(...axis.words);
  }

  if (has("理由|わけ|原因|把握|確認")) {
    add.push("どうしたの", "どうして", "なんで", "なぜ", "理由", "わけ", "教えて", "話してくれる", "聞かせて", "どこが嫌", "どこが難しい");
  }
  if (has("共感|寄り添い|気持ち")) {
    add.push("そっか", "そうだよね", "わかるよ", "つらかったね", "嫌だったね", "疲れたね", "大変だったね");
  }
  if (has("安心")) {
    add.push("大丈夫", "安心して", "そばにいる", "一緒にいる", "落ち着いていこう");
  }
  if (has("休む|休憩|一息|切り替え|切替|区切り")) {
    add.push("休憩", "休憩してから", "ちょっと休憩", "少し休憩", "休んでから", "少し休んで", "一休み", "ひと休み", "ちょっと休もう", "少し休もう", "あと5分", "区切り");
  }
  if (has("楽しみ|見通し|見とおし")) {
    add.push("終わったら", "あとで楽しみ", "次にしよう", "楽しみにしよう");
  }
  if (has("自主性|工夫|自分のペース|自分で|選択")) {
    add.push("自分のペースで", "無理しなくていい", "やりやすい方法で", "自分で", "どっち", "どこから", "できそう");
  }

  return uniq([...base, ...add]);
}

function evaluateCommonAxes(textN) {
  return AXES.map((axis) => {
    const matchedWords = axis.words.filter((word) => makeMatcher([word])(textN));
    return {
      key: axis.key,
      label: axis.label,
      weight: axis.weight,
      matched: matchedWords.length > 0,
      matchedWords,
    };
  });
}

function buildAdvice({ commonAxes, hasScenePositive, hasSceneMust, hasNegative, hasStrongNegative }) {
  const matchedLabels = commonAxes.filter((a) => a.matched).map((a) => a.label);
  const missingLabels = commonAxes.filter((a) => !a.matched).map((a) => a.label);

  if (hasStrongNegative) {
    return "強い言い方が入っています。まず気持ちを受け止めてから、短い提案に言い換えてみましょう。";
  }

  if (hasNegative) {
    return "前向きな要素もありますが、少し強い表現が混ざっています。否定よりも選択肢で伝えるとよくなります。";
  }

  if (matchedLabels.includes("具体的な提案") && !matchedLabels.includes("気持ちの受け止め")) {
    return "提案はできています。最初に「疲れたんだね」「嫌だったんだね」を足すと、さらに伝わりやすくなります。";
  }

  if (matchedLabels.includes("気持ちの受け止め") && !matchedLabels.includes("具体的な提案")) {
    return "気持ちを受け止められています。次に、休憩・選択肢・一緒に考える提案を一つ足してみましょう。";
  }

  if (hasScenePositive || hasSceneMust || matchedLabels.length >= 2) {
    return "よい声かけです。さらに短く、子どもが選べる言い方にすると実際の場面で使いやすくなります。";
  }

  return missingLabels.length
    ? `まずは「${missingLabels[0]}」を入れてみましょう。例：「そっか、少し休んでからにしようか」。`
    : "この調子です。短く、やさしく、選べる言い方を意識しましょう。";
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

  const positives = asArray(evaluation.positive_keywords ?? evaluation.positiveKeywords);
  const negatives = asArray(evaluation.negative_keywords ?? evaluation.negativeKeywords);
  const musts = asArray(evaluation.must_include ?? evaluation.mustInclude);
  const sceneAdvice = evaluation.advice ?? "";

  const textN = normalize(String(input ?? ""));

  // 1) 共通評価軸で意味をざっくり判定
  const commonAxes = evaluateCommonAxes(textN);
  const commonScore = commonAxes.reduce((sum, axis) => sum + (axis.matched ? axis.weight : 0), 0);
  const matchedAxisLabels = commonAxes.filter((a) => a.matched).map((a) => a.label);

  // 2) シーン別キーワードは補助として使う
  const matchedPositive = buildSceneKeywordMatches(positives, textN);
  const sceneMatchedNegative = buildSceneKeywordMatches(negatives, textN);
  const matchedMust = buildSceneKeywordMatches(musts, textN, expandMustVariants);
  const missedMust = musts.filter((kw) => !includesAny(expandMustVariants(kw), textN));

  // 3) 共通NGも見る
  const commonNegative = NEGATIVE_PATTERNS.filter((word) => includesAny([word], textN));
  const strongNegative = STRONG_NEGATIVE_PATTERNS.filter((word) => includesAny([word], textN));
  const matchedNegative = uniq([...sceneMatchedNegative, ...commonNegative]);

  const posCount = matchedPositive.length;
  const negCount = matchedNegative.length;
  const mustCount = matchedMust.length;

  const hasScenePositive = posCount > 0;
  const hasSceneMust = mustCount > 0;
  const hasNegative = negCount > 0;
  const hasStrongNegative = strongNegative.length > 0;

  let resultMessage = "";

  if (hasStrongNegative && commonScore === 0 && !hasScenePositive && !hasSceneMust) {
    resultMessage = "😟 少し強い言い方です。まず気持ちを受け止めて、選べる言い方に変えてみましょう。";
  } else if (hasNegative && commonScore <= 1 && !hasScenePositive && !hasSceneMust) {
    resultMessage = "⚖️ 伝えたいことはありますが、少し強く聞こえる表現があります。やさしい言い方に置き換えてみましょう。";
  } else if (commonScore >= 4 || (commonScore >= 2 && (hasScenePositive || hasSceneMust))) {
    resultMessage = "😊✨ とても良い声かけです。気持ちを尊重しながら、次の行動につなげられています。";
  } else if (commonScore >= 2 || hasScenePositive || hasSceneMust) {
    resultMessage = "😊 良い声かけです。子どもの気持ちやペースに合わせた表現が入っています。";
  } else if (textN.length > 0) {
    resultMessage = "🤔 もう少し、気持ちを受け止める言葉や選択肢を入れてみましょう。";
  } else {
    resultMessage = "回答を入力してから評価してください。";
  }

  const advice = buildAdvice({
    commonAxes,
    hasScenePositive,
    hasSceneMust,
    hasNegative,
    hasStrongNegative,
  }) || sceneAdvice;

  const out = {
    result: resultMessage,
    advice,
    matchedPositive,
    matchedNegative,
    matchedMust,
    missedMust,
    matchedAxes: matchedAxisLabels,
    commonAxes,
    commonScore,
    positiveCount: posCount,
    negativeCount: negCount,
    mustCount,
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
