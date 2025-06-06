const scenes = [
  {
    id: 1,
    title: "勉強したくない",
    situation: "学校から帰ってきたあと、なんか疲れたな",
    image: "/images/shukudai.png",
    questions: [
      {
        id: "q1",
        child: "勉強したくない！",
        example: "今すぐじゃなくても大丈夫。30分休憩してからやる？それともおやつのあとにする？",
        advice: "疲れた気持ちに共感し、タイミングの選択肢をあたえるとより効果的です。",
        evaluation: {
          positive_keywords: ["休憩", "おやつ", "選べる", "タイミング", "疲れたよね","大丈夫"],
          negative_keywords: ["やらない", "だめ", "なんで"],
          must_include: ["大丈夫", "疲れた", "休憩", "あとで", "おやつ", "選んで", "無理しない", "タイミング"],
          advice: "疲れに共感し、選択肢を提示するとさらに良くなります。"
        }
      }
    ]
  },
  {
    id: 2,
    title: "登校（園）したくない",
    situation: "朝の準備をしている時に子どもが。",
    image: "/images/touen.png",
    questions: [
      {
        id: "q1",
        child: "学校（保育園）行きたくない！",
        example: "そうなんだ、今日はあまり行きたくない気分なんだね。\n何かイヤなことがあるの？話してくれてもいいよ",
        advice: "不安や嫌な気持ちの理由を優しく聞き出すことが大切です。",
        evaluation: {
          positive_keywords: ["気持ち", "話して", "理由", "聞く"],
          negative_keywords: ["行きなさい", "だめ", "甘えるな"],
          must_include: ["行きたくない", "そうなんだ", "話していい", "何かある", "理由", "気持ち", "不安"],
          advice: "気持ちを否定せず、理由を優しく引き出してあげましょう。"
        }
      }
    ]
  },
  {
    id: 3,
    title: "片付けたくない",
    situation: "おもちゃを出して遊んだ後のお片付けの時間",
    image: "/images/kataduke.png",
    questions: [
      {
        id: "q1",
        child: "片付けやだー！",
        example: "楽しかったんだね。もっと遊びたいよね。\nあと3分でお片づけしようか。一緒にしよう！",
        advice: "共感しつつ、タイマーなどで区切りを作るとスムーズです。",
        evaluation: {
          positive_keywords: ["楽しかった", "遊びたい", "一緒", "タイマー", "区切り"],
          negative_keywords: ["すぐ片付けなさい", "だらしない"],
          must_include: ["あと少し", "一緒に", "楽しかった", "タイマー", "遊びたい", "決めよう"],
          advice: "気持ちを受け止めてから、次の行動に移す工夫を入れましょう。"
        }
      }
    ]
  },
  {
    id: 4,
    title: "お風呂入りたくない",
    situation: "ルーティンでお風呂に入る時間になったよ",
    image: "/images/ofuro.png",
    questions: [
      {
        id: "q1",
        child: "お風呂いやー入りたくない！",
        example: "お風呂でアヒルさんと遊ぼう！\n今すぐ入る？それともママと競争して入る？",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["遊ぶ", "アヒル", "競争", "楽しい"],
          negative_keywords: ["入りなさい", "だめ"],
          must_include: ["遊ぼう", "アヒル", "競争", "どっちが早い", "入るタイミング", "選ぼう"],
          advice: "楽しい印象を持てるような言葉かけが効果的です。"
        }
      }
    ]
  },
  {
    id: 5,
    title: "ゲームやめたくない",
    situation: "食事前や就寝前にゲームをやめられない子ども",
    image: "/images/game.png",
    questions: [
      {
        id: "q1",
        child: "まだゲームしたいのにー！",
        example: "今のステージで終わる？それともあと1回プレイしてからにしたらどうかな？\nごはんのあとに続きをやるのはどう？",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["あと1回", "ステージ", "ごはんのあと"],
          negative_keywords: ["やめなさい", "だめ"],
          must_include: ["あと1回", "終わったら", "気持ち","わかる", "続き", "次にしよう", "ごはんのあと","終われる"],
          advice: "区切りや選択肢を提示してあげましょう。"
        }
      }
    ]
  },
  {
    id: 6,
    title: "兄弟げんかの仲裁",
    situation: "日常的に起こる兄弟げんか。特に「〇〇がわざとやった！もう遊ばない」と感情が高ぶっているとき",
    image: "/images/kenka.png",
    questions: [
      {
        id: "q1",
        child: "あっちが先にやってきた！",
        example: "まず順番にお話しを聞かせてくれる？\n〇〇はどう思ったの？自分の気持ちを教えて",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["順番", "気持ちを聞く", "落ち着いて", "話して"],
          negative_keywords: ["怒らない", "うるさい", "どっちも悪い"],
          must_include: ["順番に", "気持ち", "どう思った", "話して", "落ち着いて", "それぞれ"],
          advice: "どちらの気持ちも公平に聞くスタンスが重要です。"
        }
      }
    ]
  },
  {
    id: 7,
    title: "ごはん食べたくない",
    situation: "食事の時間になりました。でも子どもが。",
    image: "/images/gohan.png",
    questions: [
      {
        id: "q1",
        child: "ごはんいらない。おやつがいい",
        example: "この中で一番食べたいのはどれかな？一口だけでもどう？\nおやつ食べたいくらいお腹すいてるんだね",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["一口", "選んでいい", "お腹すいてる", "どれが食べたい？"],
          negative_keywords: ["だめ", "食べなさい", "わがまま言わない"],
          must_include: ["どれがいい", "一口", "食べやすい", "選んで", "お腹すいてる", "少しだけ"],
          advice: "選択肢を与え、共感をもって促しましょう。"
        }
      }
    ]
  },
  {
    id: 8,
    title: "外出イヤ",
    situation: "お出かけの準備をしている途中で「行きたくない…おうちがいい」と言い渋る子ども",
    image: "/images/outing.png",
    questions: [
      {
        id: "q1",
        child: "行きたくない…おうちがいい",
        example: "おうちが落ち着くよね。出かけるのちょっと気が進まないんだね\n行ったらどんなことがあるか、一緒に考えてみようか",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["落ち着く", "気が進まない", "一緒に考えよう"],
          negative_keywords: ["早くして", "わがまま", "外に出なさい"],
          must_include: ["おうちがいい", "落ち着く", "出かける理由", "一緒に考えよう", "不安", "どんなこと"],
          advice: "安心感を与えた上で、目的を一緒に考えると効果的です。"
        }
      }
    ]
  },
  {
    id: 9,
    title: "くつが履けない",
    situation: "登園直前に「履けない！」と子どもが強く主張する",
    image: "/images/kutsu.png",
    questions: [
      {
        id: "q1",
        child: "くつが入らないー！",
        example: "ちょっと手伝ってもいい？一緒にやろう！",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["手伝う", "一緒に", "やってみよう", "できそう"],
          negative_keywords: ["自分でやりなさい", "なんでできないの"],
          must_include: ["手伝う", "一緒に", "できる", "ゆっくり", "困った", "挑戦しよう"],
          advice: "「できない」を責めず、一緒に挑戦する姿勢が大切です。"
        }
      }
    ]
  },
  {
    id: 10,
    title: "寝たくない",
    situation: "就寝時間になっても「まだ寝たくない！もっと遊びたい」と言う",
    image: "/images/neru.png",
    questions: [
      {
        id: "q1",
        child: "まだ寝たくない！",
        example: "寝る時に、今日一日のお話きかせてくれる？\nあと3分で終わりにしよう。タイマー鳴ったらお布団ね",
        advice: "編集予定",
        evaluation: {
          positive_keywords: ["あと3分", "お話きかせて", "タイマー", "区切り","楽しかった"],
          negative_keywords: ["寝なさい", "早く", "いい加減にして"],
          must_include: ["あと3分", "お話して", "タイマー", "遊びたい", "ふとん", "寝る","絵本"],
          advice: "寝ることへの抵抗を和らげ、見通しを持たせましょう。"
        }
      }
    ]
  }
];

export default scenes;
